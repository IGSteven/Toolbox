// 
//  _______ ____   ____  _      ____   ______   __
// |__   __/ __ \ / __ \| |    |  _ \ / __ \ \ / /
//    | | | |  | | |  | | |    | |_) | |  | \ V / 
//    | | | |  | | |  | | |    |  _ <| |  | |> <  
//    | | | |__| | |__| | |____| |_) | |__| / . \ 
//    |_|  \____/ \____/|______|____/ \____/_/ \_\
//                                                                                                                                        
//
// Toolbox of Network & Admin Tools
// Created by: @IGSteven
//

global.__basedir = __dirname;
global.utils = require(__basedir + '/src/utils');
global.config = require(__basedir + '/data/config');
global.tmp = {};
const app = require(__basedir + '/src/webserver');


/// TESTING AREA // 
// ALL CODE BELOW THIS LINE IS FOR TESTING PURPOSES ONLY