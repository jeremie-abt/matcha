/*
*   jabt : module in order to produce modular statement
*   for SQL
*   Note : 
*   J'essaye de le faire en obj juste pour me mettre a niveux la dessus
*   on pourra tout repasser en fonctionel
*/

/*
*   exemple of how it works
formatter.where({
  and : {
    range : {
      user_id : [5, 29],
    },
    eq : {
      lastname : "fredo"
    }
  },
  or : {
    range : {
      user_id : [15,25] 
    }
  } 
})
*/
class Req_formatter {
  
  _eq = "="   // equal
  _gt = ">"   // greater than
  _ge = ">="  // greater equal
  _lt = "<"   // less than
  _le = "<="  // less equal
  _ne = "!="  // not equal
  
  constructor() {
    this._where_statement = ""
    //this.optional_where_statement = {}
    this._where_arg_count = 1
    this._where_arg_values = []
    // aggregation statement et tout
    
  }
  
  
  /*
  * @ args : complex object to parse see doc
  */
  where(args) {
  
    /*
    * @args : sub object of the upper scope args
    * @type : string (either "or" or "and")
    */
    const sub_procedure = (args, type) => {
    
      for (let [operator, val] of Object.entries(args)) {
        for (let sub_key in val) {
          this._add_where_condition(
              sub_key, val[sub_key], operator, type.toUpperCase()
          )
        }
      }
    }
    if ("or" in args) {
      sub_procedure(args["or"], "or")
    }
    if ("and" in args) {
      sub_procedure(args["and"], "and")
    }

    console.log("request : ", this._where_statement, "\n")
    console.log("les args", this._where_arg_values)
  }
  
  _add_where_condition(field, value, operator, type) {
  // where statement est vide donc 


  if (this._where_statement === "") {
    this._where_statement += "WHERE "
  } else {
    this._where_statement += `${type} `
  }
  console.log(operator)
  const op = eval("this._" + operator)
  if (typeof op === 'function') {
    op(field, value)
  } else {
    this._where_statement += `${field} ${op} $${this._where_arg_count} `
    this._where_arg_count += 1
    this._where_arg_values.push(value)
  }
}
  
  _range = (field, value) => {
    // un peu sale mais bon
  
    if (value.length !== 2) {
      throw `_range awaiting an array with two elements`
    }
    const statement = `${field} `
                    + `BETWEEN $${this._where_arg_count} `
                    + `AND $${this._where_arg_count + 1} `
    console.log("value 1 et 2 ", value[0], " ", value[1])
    this._where_arg_values.push(value[0], value[1])
    this._where_arg_count += 2
    this._where_statement += statement
  }
}

module.exports = Req_formatter
