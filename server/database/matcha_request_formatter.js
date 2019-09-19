/*
*   jabt : module in order to produce modular statement
*   for SQL
*   Note : 
*   J'essaye de le faire en obj juste pour me mettre a niveux la dessus
*   on pourra tout repasser en fonctionel
*/


class Req_formatter {

  /**
   * METHODS :
   *    - flush : This clean the all object and allow you to remake
   *      a new request from the begining
   *    - add_aggregation : add aggragation function to some fields, see example below
   *    For now the setters doesn't
   *    - set_group_by : add a group_by statement to the function
   *    - set_limit : add limit statement (either two number for a range or just one numb)
   *    - set_order_by : add a order_by statement to the function
   *    - add_fields : add some fields, see example below
   *    - where : add where statement
   *    - join : add join
   *    - generate_query : return tab with the string query and the values tab 
   *        of the query
   */

  _eq = "="   // equal
  _gt = ">"   // greater than
  _ge = ">="  // greater equal
  _lt = "<"   // less than
  _le = "<="  // less equal
  _ne = "!="  // not equal
  
  /**
   *  method to call when you want to make a new request
   *  and flush all the existing params 
   */
  flush() {
    this.table = ""
    this._join_statement = ""
    this._where_statement = ""
    this._group_by = ""
    this._order_by = ""
    this._having = ""
    this._limit = ""
    this._value_index = 1
    // this._where_arg_values = [] // faut suppr mais je laisse
    // car ca peut generer des bueugs
    this._field_names = []
    this._field_values = []
    this._value_linker = []
    //this._value_linker = {} // pareil a suppr mais possibilit de beugs

  }
  
  constructor() {
    this.flush()
  }
  
  /**
   * @param {Object} args 
   */
  add_aggregation(args) {
    
    //  deprecated => y'a pas de fonction d'aggregation sur du where
    //  const where_builder = (field_name, aggregated_field_name) => {
    //  this._where_statement = this._where_statement.replace(
    //    field_name, aggregated_field_name)
    //  }

    const field_builder = (field_name, aggregated_field_name) => {
      this._field_names = this._field_names.map(x => {
        if (x === field_name) {
          return aggregated_field_name
        }
        return x
      })
    }
    
    for (let top_key in args) {
      for (let [field, aggregations] of Object.entries(args[top_key])) {
        if (!Array.isArray(aggregations)) {
          aggregations = [aggregations]
        }
        let aggregated_full_name = ""
        for (let aggregation of Object.values(aggregations)) {
          if (aggregated_full_name === "") {
            aggregated_full_name = aggregation.toUpperCase() + '()'
          }
          else {
            aggregated_full_name = aggregation.toUpperCase() + '('
                                + aggregated_full_name + ')'
          }
        }
        let len = aggregations.length
        aggregated_full_name = 
            aggregated_full_name.substring(0, aggregated_full_name.length - len)
            + field + ')'.repeat(len)
        
        const building_function = eval(`${top_key}_builder`)
        building_function(field, aggregated_full_name)
      }
    }
    return this
  }

  /**
   * 
   * @param {string || Array} fields_name 
   */
  set_group_by(fields_name) {    

    let group_by_statement = ''
    if (this._group_by === '') {
      group_by_statement = "GROUP BY "
    } else {
      group_by_statement = this._group_by + ' '
    }
    if (!Array.isArray(fields_name)) {
      fields_name = [fields_name]
    }
    group_by_statement += fields_name.join(', ') 
    this._group_by = group_by_statement
    return this
  }

  /**
   * @param {string} begin 
   * @param {string} end 
   */
  set_limit(begin, end=null) {
   
    begin = parseInt(begin)
    
    if (isNaN(begin))
      return
    let limit_statement = ""
    limit_statement = ` LIMIT ${begin}`
    if (end !== null && !isNaN(parseInt(end))) {
      limit_statement += ` OFFSET ${end}` 
    }
    this._limit = limit_statement
    return this
  }

  /**
   * @param {string || Array} fields 
   */
  set_order_by(order_by_conditions) {

    /**
     * cette partie est totalement discutable,
     * enfaite en demandant un input de ce type :
     * [["lastname", "desc"], ["firstname", "asc"]]
     * enfaite si je ne fais pas ca rien ne me garanti
     * que si l'user me file un obj il sera en ordre
     * et pour order by l'ordre de tri compte !
     */
    
    let order_by_statement = ''

    if (this._order_by === ''){
      order_by_statement = "ORDER BY "
    } else {
      order_by_statement = this._order_by + ', '
    }
    order_by_conditions.forEach( elem => {
      order_by_statement += `${elem[0]} ${elem[1].toUpperCase()}, `
    })
    order_by_statement = order_by_statement
        .substring(0, order_by_statement.length - 2) 
    this._order_by = order_by_statement
    return this
  }

  set_having() {
    console.log("not implemented, if needed contact JABT")
  }

  /**
   * 
   * @param {Array || Object} fields  
   *    Array => push only the Array in this._field_names
   *    Object => keys push in this ._field_names
   *    and values pushed into this._field_values 
   */  
  add_fields(fields) {

    if (Array.isArray(fields)) {
      this._field_names = this._field_names.concat(fields)
    } else {
      for (let [key, val] of Object.entries(fields)) {
        this._field_names.push(key)
        this._field_values.push(val)
      }
    }
    return this
  }
 
  // c'est paas ouff ouff mais bon j'ai pas trouver mieux
  // j'ai essayer de regarder un peu les big ORM
  // mais ils font des trucs de ouff donc c'est un truc simple qui marche quoi
  /**
   * @param {string} foreign_table 
   * @param {string} foreign_key 
   * @param {string} inner_key 
   * @param {string} type 
   */
  join(foreign_table, foreign_key, inner_key, type="inner") {
    type = type.toUpperCase()
    this._join_statement += (type + ` JOIN ${foreign_table} `
                    + `ON ${this.table}.${inner_key} = `
                    + `${foreign_table}.${foreign_key}`
    )
    return this
  }

  /**
   * @param {Object} args 
   */
  where(args) {
    
    /**
     * @param {Object} args   sub object of args 
     * @param {string} type   either ("or" and "and")
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
    return this
  }

  /**
   * 
   * @param {string} type
   *    either select, update, insert, delete,
   *    je sais j'aurais du faire une enum c'est plus clean
   *    sauf que tu te retrouves avec SELECT = "select",
   *    UPDATE = "update" etc ..., donc je laisse comme ca
   *    je trouve ca ok a voir 
   */
  generate_query(type){

    const type_handlers = {
      "select" : _get_select,
      "insert" : _get_insert,
      "update" : _get_update,
      "delete" : _get_delete
    }
    
    type = type.toLowerCase();
    if (!(type in type_handlers)) {
      throw `${type} not a valid type of request\n`
    }
    else {
      // je sais c'est sale mais c'est la seule fasons pour que 
      // l'inheritance de variable soit faite
      var [field_names, field_values] = this._get_fields()

      const field_statement = type_handlers[type](this)
      let final_statement = field_statement + " "
                            + this._join_statement + " "
                            + this._where_statement +  " "
                            + this._group_by
                            + this._order_by
                            + this._limit + ";"
      return [final_statement, this._value_linker]
    }

    function _get_select(that) {

      let statement = "SELECT "
      let field_statement = ""
  
      if (field_values.length === 0) {
        if (field_names.length > 0) {
          field_statement += field_names.join(", ")
        }
        else {
          field_statement += "*"
        }
      }
      else if (field_values.length >= 1) {
        for (let i = 0; i < field_names.length; i++) {
          field_statement += `${field_names[i]} AS ${field_values[i]}, `
        }
        field_statement = field_statement
                          .substring(0, field_statement.length - 2)
      }
      if (field_statement === '') {
        console.log("l.305")
        return -1
      }
      return (statement + field_statement + ` FROM ${that.table}`)
    }
  
    function _get_insert(that) {

      let statement = `INSERT INTO ${that.table} (`
      
      if (field_values.length <= 0){
        return -1
      }
      statement += field_names.join(', ') + ') '
      statement += "VALUES ("
      let index = that._value_index
      for (let i = index; i < field_values.length + index ; i++) {
        statement += `$${i}, `
        that._value_linker.push(field_values[i - index])
        // updating value_linker to become tab,
        // before it was an object
        // that._value_linker[i] = field_values[i]
      }
      that._value_index += field_values.length
      statement = statement.substring(0, statement.length - 2) + ')'
      return statement
    }

    function _get_update(that) {

      let statement = `UPDATE ${that.table} SET `
    
      if (field_names.length !== field_values.length ||
          field_names.length <= 0) {
        console.log("l.340")
        return -1
      }

      // !~ clairement un beug ici dans la boucle !!! a regler 
      //const len_computed = i + field_names.length // eviter la boucle inf ...
      const len =  field_names.length
      let i = 0
      for (let index in field_names) {
        statement += `${field_names[index]} = `
                  + `$${that._value_index}, ` 
        that._value_linker.push(field_values[index])
        that._value_index += 1
      }
      // while (i < len) {
      //   statement += `${field_names[i - 1]} = $${}, `
      //   that._value_linker.push(field_values[i - 1])
      //   // updating value_linker to become tab,
      //   // before it was an object
      //   // that._value_linker[i] = field_values[i - 1]
      //   that._value_index += 1
      //   i++
      // }
      statement = statement.substring(0, statement.length -2)
      return statement
    }

    function _get_delete (that) {
      return `DELETE FROM ${that.table} `
    }
  }
  
  _add_where_condition(field, value, operator, type) {
    
    if (this._where_statement === "") {
      this._where_statement += "WHERE "
    } else {
      this._where_statement += `${type} `
    }
    const op = eval("this._" + operator)
    if (typeof op === 'function') {
      op(field, value)
    } else {
      this._where_statement += `${field} ${op} $${this._value_index} `
      this._value_index += 1
      this._value_linker.push(value)
      //this._where_arg_values.push(value)
    }
  }

  _get_fields() {

    if (
        this._field_values.length === 0 ||
        this._field_names.length === this._field_values.length) {
      return [this._field_names, this._field_values]
    }
    return -1
  }
  
  _range = (field, value) => {

    // un peu sale mais bon    
    if (value.length !== 2) {
      throw `_range awaiting an array with two elements`
    }
    const statement = `${field} `
    + `BETWEEN $${this._value_index} `
    + `AND $${this._value_index + 1} `
    this._where_arg_values.push(value[0], value[1])
    //this._where_arg_values.push(value[0], value[1])
    this._value_index += 2
    this._where_statement += statement
  }
}

// a voir si c'est clair ou pas !
/**
 *  EXEMPLE :
 *    - add_aggregation and add_fields:
 *      ```
 *        obj = new Req_formatter()
 *        obj.add_fields({
 *          lastname: "jean",
 *          firstname: "jacque",
 *          username: "jejems"
 *        })
 *          .where({
 *          and: {
 *            le: {
 *              user_id: 29
 *            }
 *          }
 *        })
 *          .add_aggregation({
 *          field: {
 *            lastname: ["count", "avg"],
 *            firstname: "count"
 *          }
 *        })
 *        // outpout : 
 *              SELECT AVG(COUNT(lastname)) AS jean, COUNT(firstname) AS jacque,
 *              username AS jejems FROM matcha  WHERE user_id <= $1  ;
 * 
 *      - set_order_by :
 *        obj.set_order_by([['lastname', 'asc'], ['username', 'desc']])
 *        // outpout : ... ORDER BY lastname ASC, username DESC;
 *      ```
 *    
 *    
 *    - add_aggregation and add_fields:
 *      ```
 *        obj = new Req_formatter()
 *        obj.table = "users"
 *        obj.add_fields({
 *          lastname: "jean",
 *          firstname: "jacque",
 *          username: "jejems"
 *        })
 *          .where({
 *          or: {
 *            eq: {
 *              lastname: "abt",
 *              username: "jejems"
 *            }
 *          },
 *          and: {
 *            le: {
 *              firstname: "jermeie",
 *              test: 5
 *            }
 *          }
 *          })
 *          .join("seen", "seen_id", "id", "left")
 *      console.log(obj.generate_query("select")[0])
 *      console.log(obj.generate_query("select")[1])
 *      OUTPOUT : 
 *      SELECT lastname AS jean, firstname AS jacque, username 
 *      AS jejems FROM users LEFT JOIN seen ON users.id = seen.seen_id
 *      WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND
 *      test <= $4  ;
 *      [ 'abt', 'jejems', 'jeremie', 5 ]
 *      
 *      
 *      obj.flush()
 *      obj.table = "users"
 *      obj.add_fields({
 *        lastname: "jean",
 *        firstname: "jacque",
 *        username: "jejems"
 *      })
 *        .where({
 *          or: {
 *            eq: {
 *              lastname: "abt",
 *              username: "jejems"
 *            }           
 *          },
 *        and: {
 *          le: {
 *            firstname: "jeremie",
 *            test: 5
 *          }
 *        }
 *      })
 * 
 *     console.log(obj.generate_query("update"))
 *     OUTPOUT : 
 *      [
 *        'UPDATE users SET lastname = $5, firstname = $6, username = $7  WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND test <= $4  ;',
 *          [
 *            'abt', 'jejems', 'jeremie', 5, 'jean', 'jacque', 'jejems'
 *          ]
 *      ]
 *    
 * 
 *      console.log(obj.generate_query("insert"))
 *      OUTPOUT : 
 *      [
 *        'INSERT INTO users (lastname, firstname, username) VALUES ($5, $6, $7)  WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND test <= $4  ;',
 *          [
 *            'abt', 'jejems', 'jeremie', 5, 'jean', 'jacque', 'jejems'
 *          ]
 *      ]
 * 
 *      console.log(obj.generate_query("delete"))
 *      [
 *        'DELETE FROM users   WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND test <= $4  ;',
 *        [ 'abt', 'jejems', 'jeremie', 5 ]
 *      ]
 *      ```
 *  
 *  
 */
module.exports = Req_formatter
