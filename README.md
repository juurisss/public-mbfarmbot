# MBFARMBOT

## Table of Contents
- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## About
MBFarmBot is an efficient bot for farming in the server, Mineberry. This bot offers a range of commands that can be utilized for various activities, including farming kills or messing with players in the lobbies.

## Features
- Easy to use
- Commands

## Installation
For Windows:
1. Open CMD or Terminal and execute `winget install Git.Git` to install Git or directly from [Git Releases](https://github.com/git-for-windows/git/releases/latest/).
2. Once Git is installed, execute this command to install NodeJS: `winget install OpenJS.NodeJS` or directly from [Node.js](https://nodejs.org/dist/latest/node-v21.3.0-x64.msi) (Possibly outdated).
3. After installing these, execute the following commands:
    ```
    git clone https://github.com/EjurisYY/public-mbfarmbot
    cd public-mbfarmbot
    npm i
    ```
4. Modify `config.js` as needed. You can open it with Notepad.
5. Run the bot by typing `node index.js`.

## Usage
Once the script is running, it's important to ensure that all bots are present within the lobby environment. To initiate their involvement, individually invite each bot and execute the `/party accept` command within the console after ensuring all bots have received invitations. The bot's functionalities can be accessed and controlled by using the `/pc !{command}` format.

Available Commands:
- `!move (Forward|Back|Left|Right) {Duration}` - Moves the bot in a specified direction. If no duration is provided, the default duration is set to 5 seconds.
- `!follow {player}` - Instructs the bot to follow a specific player.
- `!stopfollow` - Makes the bot stop following the specific player.
- `!trackplayer {player}` - Directs the bot's head to aim on a particular player.
- `!stoptrack` - Stops the bot from looking at a specific player.
- `!looknear` - Makes bot to look the nearest player.
- `!goto {x} {y} {z}` - Makes the bot to walk towards specified coordinates.


## License
Copyright © 2023 EjurisYT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contact
If you encounter any issues, please contact me via Discord at `ejurisyt`.