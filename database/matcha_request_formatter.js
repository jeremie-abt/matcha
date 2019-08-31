/*
*   jabt : module in order to produce modular statement
*   for SQL
*   Note : 
*   J'essaye de le faire en obj juste pour me mettre a niveux la dessus
*   on pourra tout repasser en fonctionel
*/

// const eq = '='

class Req_formatter {
  
  _eq = "="
  
  constructor() {
    this.where_statement = ""
    //this.optional_where_statement = {}
    this.where_arg_count = 1
    this.where_arg_values = []
    // aggregation statement et tout
    
  }
  
  
  /*
  * @ args : complex object to parse see doc
  */
 where(args) {
  
  
  if ("and" in args) {
    for (let [operator, val] of Object.entries(args.and)) {
      for (let sub_key in val) {
        this._add_where_condition(sub_key, val[sub_key], operator)
      }
    }
  }
}
  
  _add_where_condition(field, value, operator) {
    // where statement est vide donc 
    
    
    if (this.where_statement === "") {
      this.where_statement += "WHERE "
    } else {
      this.where_statement += "AND "
    }
    console.log(operator)
    const op = eval("this._" + operator)
    if (typeof op === 'function') {
      op(field, value)
    } else {
      this.where_statement += `${field} ${op} $${this.where_arg_count} `
      this.where_arg_count += 1
      this.where_arg_values.push(value)
    }
  }
  
  _range = (field, value) => {
    // un peu sale mais bon
  
    if (value.length !== 2) {
      throw `_range awaiting an array with two elements`
    }
    const statement = `${field} `
                    + `BETWEEN $${this.where_arg_count} `
                    + `AND $${this.where_arg_count + 1} `
    this.where_arg_values.push(value[0], value[1])
    this.where_arg_count += 2
    this.where_statement += statement
  }
}




module.exports = Req_formatter