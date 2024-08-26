import {createWriteStream, writeFileSync} from 'fs'

const file = '/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php/test.php';
writeFileSync(file, 'AAABBB');
const stream = createWriteStream('/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php/test.php', 'utf-8');
stream.on('finish', () => {
    console.log('stream finish !!!');
});
stream.on('error', (err) => {
    console.log('stream error !!!', err);
});
stream.on('open', () => {
    console.log('stream open !!!');
});
stream.on('close', () => {
    console.log('stream close !!!');
    stream.destroy();
});
stream.on('ready', () => {
    console.log('stream ready !!!');
    stream.write(JSON.stringify({a: 0}));
    stream.write('\n');
    stream.end();
    stream.close();
});
