import * as moment from 'moment';
import config from 'src/config/config';

const customHelpers = {
    contentFor: function (name:any, options:any) {
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
    section: function(name:any, options:any) { 
      if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
    },
    dateFormat: function(type:any, options:any=""){
        return moment(options).format(type)
    },
    basePath:function(){
      return config.BASE_PATH
    },
    particularField:function(object:any,req:any){
      console.log("object req",object,object["req"])
      return object[req]
    }
  }

  export default customHelpers;