/**
 * 测试流程
 */
import path from 'path';
import {SentryWorkflow} from '../src/SentryWorkflow';
const wf: SentryWorkflow = new SentryWorkflow({configFile: './.sentryclirc'});

// wf.start({
//             include: ['js'],
//             sourceMapPath: 'sourcemap',
//             publishBase: path.resolve(__dirname, 'dist')
//         },
//          'test2').then(() => {
//     // console.log('end');
// });
wf.deploy('test', 'prod');
