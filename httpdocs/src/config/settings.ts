const settings = {
  "fields": [
    {
      "type":"text",
      "name":"Text",
      "info": "Small or long text like title or description",
      "basic_setting":[
        {
          "name":"name",
          "info": "No space is allowed for the name of the attribute",
          "type":"text",
          "field":"input",          
          "input_name":"name"
        },
        {
          "name":"Short Text",
          "info": "Best for titles, names, links (URL). It also enables exact search on the field.",
          "type":"radio",
          "field":"input",
          "input_name":"short_text"
        },
        {
          "name":"Long Text",
          "info": "Best for descriptions, biography. Exact search is disabled.",
          "type":"radio",
          "field":"input",
          "input_name":"long_text"
        }
      ],
      "advanced_setting":[
        {
          "name":"Default value",
          "info": "",
          "type":"text",
          "field":"input",          
          "input_name":"default_value"
        },
        {
          "name":"RegExp pattern",
          "info": "The text of the regular expression",
          "type":"text",
          "field":"input",          
          "input_name":"regex_pattern"
        },
      ]
    },
    {
      "type":"email",
      "name":"Email",
      "info": "Email field with validations format",
      "basic_setting":[
        {
          "name":"Name",
          "info": "No space is allowed for the name of the attribute",
          "type":"text",
          "field":"input",          
          "input_name":"email"
        }
      ],
      "advanced_setting":[
        {
          "name":"Default value",
          "info": "",
          "type":"text",
          "field":"input",          
          "input_name":"email"
        },
        {
          "settings":[
            {
              "name":"Required field",
              "info": "You won't be able to create an entry if this field is empty",
              "type":"checkbox",
              "field":"input",          
              "input_name":"required_field"
            },
          ]
        }
      ]
    }
  ]
}

export default settings
