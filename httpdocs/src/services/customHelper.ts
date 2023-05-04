import * as moment from 'moment';
import config from 'src/config/config';

const customHelpers = {
  contentFor: function (name: any, options: any) {
    const blocks = options.data?.blocks || {};
    const block = blocks[name] || [];
    block.push(options.fn(this));
    blocks[name] = block;
    options.data.blocks = blocks;
  },
  block: function (name: string | number) {
    const val = (this._blocks || {})[name];
    return val ? val.join('\n') : null;
  },
  log: function (input: any, print: any) {
    return console.log("=", print, "=>", input);
  },
  section: function (name: any, options: any) {
    if (!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
  },
  dateFormat: function (type: any, options: any = "") {
    return moment(options).format(type)
  },
  basePath: function () {
    return config.BASE_PATH
  },
  particularField: function (object: any, req: any) {
    if (object && req) {
      return object[req]
    }
    return ""

  },
  select: function (selected: any, options: any) {
    if (typeof selected === 'string') {
      return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    } else {

    }
  },
  //this is to already selected status at edit time
  statusselect: function (selected: any, options: any) {
    return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& checked');
  },
  findIndex: function (role_id: any, value: any) {
    let ind = role_id.indexOf(value)
    if (ind >= 0) {
      return true
    } return false
  },
  dynamicPartial: function (partialName: any) {
    return `builderPartials/${partialName}`
  },


}



export default customHelpers;