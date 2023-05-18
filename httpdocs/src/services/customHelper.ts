import * as moment from 'moment';
import config from 'src/config/config';
import axios from 'axios';

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
    if (object && req && object[req]) {
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
  defaultCheck: function (value: any, currentValue: any) {

    if (value && currentValue && (value === currentValue)) {
      return 'checked'
    }
    return ''
  },
  dynamicPartial: function (partialName: any) {
    return `builderPartials/${partialName}`
  },
  findIndex: function (allvalue: any, currentValue: any) {
    if (allvalue && currentValue && (allvalue.indexOf(currentValue) >= 0)) {
      return true
    }
    return false
  },

  getdata: async function (collection_name: any, field_name: any, site_id: any, id: any) {
    // console.log("collection_name ,site_id,field_name from custom helper", collection_name, field_name, site_id)
    // console.log("id of the custom helper", id)
    await axios.get('http://localhost:3001/data-filing/multiselect', {
      params: {
        collection_name: collection_name,
        field_name: field_name,
        site_id: site_id
      }
    }).then((data: any) => {
      if (data.data) {
        console.log("data of the customhelper", data.data)
        return data.data
      } else {
        return []
      }
    })



  },
  json: function (obj: any) {
    return JSON.stringify(obj)
  }


}



export default customHelpers;