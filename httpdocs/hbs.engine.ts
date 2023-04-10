import exphbs from 'express-handlebars';
import { registerHelper } from 'handlebars';

export const hbsEngine = () => {
  registerHelper('extends', function(contentxt) {
    alert(contentxt);
  });
};
