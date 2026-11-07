import './helpers/string-colors.ts';
import { withoutTool, withTools } from './patterns/tool/tool-use.ts';
import { withoutPlanning, withPlanning } from './patterns/plan/plan.ts';

console.clear();

console.log('Starting the application...');

// await withTools();
await withPlanning();
