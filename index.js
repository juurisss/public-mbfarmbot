    const mineflayer = require('mineflayer');
    const { pathfinder, goals, Movements } = require('mineflayer-pathfinder');
    const config = require('./config.js');

    let botIndex = 0;
    let bots = [];
    let jumpInterval;
    let antiAfkStatus = {};

    const initBot = () => {
        while (botIndex < config.usernames.length) {
            const username = config.usernames[botIndex];
            const srvIP = config.srvIPs[botIndex % config.srvIPs.length];
            const botArgs = {
                host: srvIP,
                username: username,
                password: config.password,
            };

            const bot = mineflayer.createBot(botArgs);
            bots.push(bot);
            botIndex++;

        bot.once('login', () => {
            login();
        });

        function login() {
            const cwp = `/reg ${config.password}`;
            const rwp = `/login ${config.password}`;
            
            bot.chat(cwp);
            bot.chat(rwp);
        
            setTimeout(() => {
                performActions();
            }, 5000);
        };

        function performActions() {
            switch (config.mode) {
                case 1: // Bedwars mode
                    console.log('Bedwars Mode');
                    bot.chat('/bw')
                    break;
        
                case 2: // KitPVP Mode
                    console.log('KitPVP Mode')
                    bot.chat('/kitpvp2')
                    break;
        
                case 3: // OPSurv mode
                    console.log('OP Survival Mode')
                    bot.chat('/opsurv1')
                    break;
        
                default:
                    console.log('Invalid mode selected.');
            }
        }

        bot.on('message', (message) => {
            console.log(message.toAnsi());
            const formattedMessage = message.toString().trim();

            if (formattedMessage.startsWith('|| You were moved to lobby') ||
                formattedMessage.startsWith('| Chat is muted in lobby.') ||
                formattedMessage.startsWith('| Chat is muted in lobby. Please join any game mode to send messages.') ||
                formattedMessage.startsWith('| You\'re already logged in') ||
                formattedMessage.startsWith('| Successfully logged in!')) {
                setTimeout(() => {
                    performActions();
                }, 5000);
            }

            if (formattedMessage.startsWith('| Log in to your account.') || formattedMessage.startsWith('| Register your')) {
                login();
            }

            if (formattedMessage.startsWith('Connecting to bw-lobby')) {
                console.log('Joined BW-Lobby');
                setTimeout(() => {
                    bot.chat('/pc Joined BW Lobby')   
                }, 100);
            }

            if (formattedMessage.includes('Party ▸')) {
                if (formattedMessage.includes('!move forward')) {
                    moveDirection(bot, 'forward', formattedMessage);
                } else if (formattedMessage.includes('!move back')) {
                    moveDirection(bot, 'back', formattedMessage);
                } else if (formattedMessage.includes('!move left')) {
                    moveDirection(bot, 'left', formattedMessage);
                } else if (formattedMessage.includes('!move right')) {
                    moveDirection(bot, 'right', formattedMessage);
                } else if (formattedMessage.includes('!move sprint')) {
                    moveDirection(bot, 'sprint', formattedMessage);
                } else if (formattedMessage.includes('!move jump')) {
                    moveDirection(bot, 'jump', formattedMessage);
                } else if (formattedMessage.includes('!looknear')) {
                    lookNear(bot);
                } else if (formattedMessage.includes('!trackplayer')) {
                    const usernameRegex = /!trackplayer\s+(\w+)/;
                    const match = formattedMessage.match(usernameRegex);
                    if (match && match[1]) {
                        trackPlayer(match[1]);
                    } else {
                        console.log('Invalid command format. Use: !trackplayer {username}');
                        bot.chat('/pc Invalid command format. Use: !trackplayer {username}');
                    }
                } else if (formattedMessage.includes('!stoptrack')) {
                    stopTracking();
                } else if (formattedMessage.includes('!goto')) {
                    const coordinatesRegex = /!goto\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)/;
                    const match = formattedMessage.match(coordinatesRegex);
                    if (match && match[1] && match[2] && match[3]) {
                        const targetPosition = {
                            x: parseFloat(match[1]),
                            y: parseFloat(match[2]),
                            z: parseFloat(match[3])
                        };
                        goTo(targetPosition);
                    } else {
                        console.log('Invalid command format. Use: !goto {x} {y} {z}');
                    }
                } else if (formattedMessage.includes('!follow')) {
                    const usernameRegex = /!follow\s+(\w+)/;
                    const match = formattedMessage.match(usernameRegex);
                    if (match && match[1]) {
                        const targetBot = match[1];
                        if (targetBot === bot.username) {
                            followPlayer(targetBot);
                        }
                    } else {
                        console.log('Invalid command format. Use: !follow {username}');
                        bot.chat('/pc Invalid command format. Use: !follow {username}');
                    }
                } else if (formattedMessage.includes('!stopfollow')) {
                    stopFollow();
                } else if (formattedMessage.includes('!anti-afk')) {
                    const usernameRegex = /!anti-afk\s+(\w+)/;
                    const match = formattedMessage.match(usernameRegex);
                    if (match && match[1]) {
                        const targetBot = match[1];
                        if (targetBot === bot.username) {
                            toggleAntiAfk(bot);
                        }
                    } else {
                        bots.forEach((currentBot) => {
                            toggleAntiAfk(currentBot);
                        });
                    }
                }
            }
            
        });

        bot.on('end', () => {
            console.log(`Disconnected`);
            setTimeout(() => {
                initBot()
            }, 5000);
        });

        bot.on('error', (err) => {
            if (err.code === 'ECONNREFUSED') {
                console.log(`Failed to connect to ${err.address}:${err.port}`);
                setTimeout(() => {
                    initBot()
                }, 5000);
            } else {
                console.log(`Unhandled error: ${err}`);
                setTimeout(() => {
                    initBot()
                }, 5000);
            }
        });

        function sendChatMessageToAll(message) {
            bots.forEach(bot => {
                if (bot && bot._client && bot._client.chat) {
                    bot._client.chat(message);
                } else {
                    console.log(`Error: Invalid bot or chat function not available for bot.`);
                }
            });
        }    
        
        process.stdin.on('data', (data) => {
            const input = data.toString().trim();
            sendChatMessageToAll(input);
        });

        // Commands:

        function moveDirection(bot, direction, formattedMessage) {
            let duration = 5; 
            let isSprint = false;
        
            const durationMatch = formattedMessage.match(/!move (forward|back|left|right|sprint|jump) (\d+)/);
            if (durationMatch && durationMatch[2]) {
                duration = parseInt(durationMatch[2], 10);
            }
        
            if (direction === 'sprint') {
                bot.setControlState('sprint', true);
                bot.setControlState('forward', true);
                isSprint = true;
            }
        
            bot.setControlState(direction, true);
        
            setTimeout(() => {
                bot.setControlState(direction, false);
                if (isSprint) {
                    bot.setControlState('sprint', false);
                    bot.setControlState('forward', false);
                }
            }, duration * 1000);
        }
        
        
        
        function sprintJump(bot) {
            bot.setControlState('sprint', true);
            bot.setControlState('jump', true);
        
            setTimeout(() => {
                bot.setControlState('jump', false);
                bot.setControlState('sprint', false);
            }, 1000);
        }
        
        function lookNear(bot) {
            const players = bot.players;
        
            const otherPlayers = Object.values(players).filter(player => player.username !== bot.username);
        
            let nearestPlayer = null;
            let nearestDistance = Infinity;
        
            for (const player of otherPlayers) {
                if (player.entity) {
                    const distance = bot.entity.position.distanceTo(player.entity.position);
                    if (distance < nearestDistance) {
                        nearestPlayer = player;
                        nearestDistance = distance;
                    }
                }
            }
        
            if (nearestPlayer) {
                bot.lookAt(nearestPlayer.entity.position.offset(0, nearestPlayer.entity.height, 0));
            } else {
                console.log('No other players found nearby or loaded.');
            }
        }

        function trackPlayer(username) {
            const playerToTrack = bot.players[username];
            if (playerToTrack) {
                trackingPlayer = username;
                trackingInterval = setInterval(() => {
                    const player = bot.players[trackingPlayer];
                    if (player && player.entity) {
                        bot.lookAt(player.entity.position.offset(0, player.entity.height, 0));
                    } 
                }, 1000);
                console.log(`Tracking player: ${username}`);
            } else {
                console.log(`Player '${username}' not found.`);
            }
        }
        
        function stopTracking() {
            clearInterval(trackingInterval);
            trackingPlayer = null;
            trackingInterval = null;
            console.log('Stopped tracking player.');
        }

        function goTo(targetPosition) {
            bot.loadPlugin(pathfinder);
            const goal = new goals.GoalBlock(targetPosition.x, targetPosition.y, targetPosition.z);
            bot.pathfinder.setGoal(goal);
        
            bot.once('goal_reached', () => {
                console.log('Reached Goal');
                setTimeout(() => {
                    const entity = bot.nearestEntity();
                    if (entity) {
                        bot.lookAt(entity.position.offset(0, entity.height, 0));
                        bot.attack(entity);
                    } else {
                        console.log("Bot is not holding any item.");
                    }
                }, 2000);
            });
        }
        
        

        function followPlayer(username) {
            const playerToFollow = bot.players[username];
            if (playerToFollow) {
                bot.loadPlugin(pathfinder);
                    bot.pathfinder.setGoal(new goals.GoalFollow(playerToFollow.entity, 3), true);
                    console.log(`Following player: ${username}`);
        
            } else {
                console.log(`Player '${username}' not found.`);
            }
        }
        
        
        function stopFollow() {
            bot.pathfinder.setGoal(null);
            console.log('Stopped following.');
        }
    }};

    function toggleAntiAfk(bot) {
        if (!antiAfkStatus || !antiAfkStatus.active) {
            startJump(bot); // Pass 'bot' object as an argument
            antiAfkStatus = { active: true, interval: jumpInterval };
            bot.chat('/pc Anti-AFK activated: Jumping');
        } else {
            stopJump(bot);
            antiAfkStatus.active = false;
            bot.chat('/pc Anti-AFK deactivated: Stopped jumping');
        }
    }
    
    function startJump(bot) {
        bot.setControlState('jump', true);
    }
    
    function stopJump(bot) {
        bot.setControlState('jump', false);
    }
    
    initBot()