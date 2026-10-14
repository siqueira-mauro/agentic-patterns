import './helpers/string-colors.ts';
import { withoutTool, withTools } from './patterns/tool-use/tool-use.ts';

console.clear();

console.log('Starting the application...');

await withTools();
