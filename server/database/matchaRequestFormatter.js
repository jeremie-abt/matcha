/*
 *   jabt : module in order to produce modular statement
 *   for SQL
 *   Note :
 *   J'essaye de le faire en obj juste pour me mettre a niveux la dessus
 *   on pourra tout repasser en fonctionel
 */

class reqFormatter {
  /**
   * METHODS :
   *    - flush : This clean the all object and allow you to remake
   *      a new request from the begining
   *    - addAggregation : add aggragation function to some fields, see example below
   *    For now the setters doesn't
   *    - setGroupBy : add a group_by statement to the function
   *    - setLimit : add limit statement (either two number for a range or just one numb)
   *    - setOrderBy : add a order_by statement to the function
   *    - addFields : add some fields, see example below
   *    - where : add where statement
   *    - join : add join
   *    - generateQuery : return tab with the string query and the values tab
   *        of the query
   */

  _eq = '=' // equl

  _gt = '>' // greater than
  
  _ge = '>=' // greate equal

  _lt = '<' // less than
 
  _le = '<=' // less equal

  _ne = '!=' // not equal

  /**
   *  method to call when you want to make a new request
   *  and flush all the existing params
   */
  flush() {
    this.table = 'matcha'

    this._joinStatement = ''
    this._whereStatement = ''
    this._groupBy = ''
    this._order_by = ''
    this._having = ''
    this._limit = ''
    this._value_index = 1
    // this._where_arg_values = [] // faut suppr mais je laisse
    // car ca peut generer des bueugs
    this._fieldNames = []
    this._fieldValues = []
    this._value_linker = []
    // 1this._value_linker = {} // pareil a suppr mais possibilit de beugs
  }

  constructor() {
    this.flush()
  }

  /**
   * @param {Object} args
   */
  // ~! A test 
  addAggregation(args) {

    const fieldBuilder = (fieldName, aggregatedFieldName) => {
      this._fieldNames = this._fieldNames.map(x => {
        if (x === fieldName) {
          return aggregatedFieldName
        }
        return x
      })
    }

    // !~ a test sans forEach
    Object.keys(args).forEach(topKey => {
      
      // !~ si ca beug essaye d'inverser aggregation et field
      // !~ foreach c'est que pour les array
      args[topKey].forEach(([field, aggregations]) => {
        let aggregationsArray = aggregations
        
        if (!Array.isArray(aggregationsArray)) {
          aggregationsArray = [aggregations]
        } else {
          aggregationsArray = aggregations
        }
        let aggregatedFullName = ''

        Object.values(aggregationsArray).forEach(aggregation => {
          if (aggregatedFullName === '') {
            aggregatedFullName = `${aggregation.toUpperCase()  }()`
          } else {
            aggregatedFullName =
              `${aggregation.toUpperCase()  }(${  aggregatedFullName  })`
          }
        })
        const len = aggregations.length
        aggregatedFullName =
          aggregatedFullName.substring(0, aggregatedFullName.length - len) +
          field +
          ')'.repeat(len)

        fieldBuilder(field, aggregatedFullName)
        })
    })
    return this
  }

  /**
   *
   * @param {string || Array} fieldsName
   */
  setGroupBy(fieldsName) {
    let groupByStatement = ''
    let arrayFieldsName = []

    if (this._groupBy === '') {
      groupByStatement = 'GROUP BY '
    } else {
      groupByStatement = `${this._groupBy  } `
    }
    if (!Array.isArray(fieldsName)) {
      arrayFieldsName = [fieldsName]
    } else {
      arrayFieldsName = fieldsName
    }
    groupByStatement += arrayFieldsName.join(', ')
    this._groupBy = groupByStatement
    return this
  }

  /**
   * @param {string} begin
   * @param {string} end
   */
  setLimit(begin, end = null) {
    let limitStatement = ''

    if (Number.isNaN(parseInt(begin, 10))) return -1
    limitStatement = ` LIMIT ${begin}`
    if (end !== null && !Number.isNaN(parseInt(end, 10))) {
      limitStatement += ` OFFSET ${end}`
    }
    this._limit = limitStatement
    return this
  }

  /**
   * @param {string || Array} fields
   */
  setOrderBy(orderByConditions) {
    /**
     * cette partie est totalement discutable,
     * enfaite en demandant un input de ce type :
     * [["lastname", "desc"], ["firstname", "asc"]]
     * enfaite si je ne fais pas ca rien ne me garanti
     * que si l'user me file un obj il sera en ordre
     * et pour order by l'ordre de tri compte !
     */

    let orderByStatement = ''

    if (this._order_by === '') {
      orderByStatement = 'ORDER BY '
    } else {
      orderByStatement = `${this._order_by  }, `
    }
    orderByConditions.forEach(elem => {
      orderByStatement += `${elem[0]} ${elem[1].toUpperCase()}, `
    })
    orderByStatement = orderByStatement.substring(
      0,
      orderByStatement.length - 2
    )
    this._order_by = orderByStatement
    return this
  }

  /*
  setHaving() {
    console.log('not implemented, if needed contact JABT')
  }
  */

  /**
   *
   * @param {Array || Object} fields
   *    Array => push only the Array in this._fieldNames
   *    Object => keys push in this ._fieldNames
   *    and values pushed into this._fieldValues
   */

  addFields(fields) {
    if (Array.isArray(fields)) {
      this._fieldNames = this._fieldNames.concat(fields)
    } else {

      Object.entries(fields).forEach( ([key, val]) => {
        this._fieldNames.push(key)
        this._fieldValues.push(val)
      })
    }
    return this
  }

  /**
   * @param {string} foreignTable
   * @param {string} foreignKey
   * @param {string} innerKey
   * @param {string} type
   */
  join(foreignTable, foreignKey, innerKey, type = 'inner') {
    this._joinStatement +=
      `${type.toLocaleUpperCase()} JOIN ${foreignTable} ` +
      `ON ${this.table}.${innerKey} = ` +
      `${foreignTable}.${foreignKey}`
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

     const subProcedure = (condition, type) => {
      Object.entries(condition).forEach(([operator, val]) => {
        Object.entries(val).forEach(([field, value]) => {
          this._addWhereCondition(
            field,
            value,
            `_${operator}`,
            type.toUpperCase()
          )
        })
      })
    }

    if ('or' in args) {
      subProcedure(args.or, 'or')
    }
    if ('and' in args) {
      subProcedure(args.and, 'and')
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
  generateQuery(type) {
    
    function _getSelect(fieldNames, fieldValues) {
      const statement = 'SELECT '
      let fieldStatement = ''
      
      if (fieldValues.length === 0) {
        if (fieldNames.length > 0) {
          fieldStatement += fieldNames.join(', ')
        } else {
          fieldStatement += '*'
        }
      } else if (fieldValues.length >= 1) {
        for (let i = 0; i < fieldNames.length; i += 1) {
          fieldStatement += `${fieldNames[i]} AS ${fieldValues[i]}, `
        }
        fieldStatement = fieldStatement.substring(
          0,
          fieldStatement.length - 2
        )
      }
      if (fieldStatement === '') return -1
      return `${statement + fieldStatement  } FROM ${this.table}`
    }
    
    function _getInsert(fieldNames, fieldValues) {
      let statement = `INSERT INTO ${this.table} (`

      if (fieldValues.length <= 0) return -1
      statement += `${fieldNames.join(', ')  }) `
      statement += 'VALUES ('
      const index = this._value_index
      for (let i = index; i < fieldValues.length + index; i += 1) {
        statement += `$${i}, `
        this._value_linker.push(fieldValues[i - index])
      }
      this._value_index += fieldValues.length
      statement = `${statement.substring(0, statement.length - 2)  })`
      return statement
    }
    
    function _getUpdate(fieldNames, fieldValues) {
      let statement = `UPDATE ${this.table} SET `
      
      if (
        fieldNames.length !== fieldValues.length ||
        fieldNames.length <= 0
        ) {
          return -1
        }

        // !~ clairement un beug ici dans la boucle !!! a regler
        // const len_computed = i + fieldNames.length // eviter la boucle inf ...
        
        for (let i = 0; i < fieldValues.length; i += 1) { 
        // fieldNames.forEach(index => {
          statement += `${fieldNames[i]} = $${this._value_index}, `
          this._value_linker.push(fieldValues[i])
          this._value_index += 1
        }
        statement = statement.substring(0, statement.length - 2)
        return statement
    }
    
    function _getDelete() {
      return `DELETE FROM ${this.table} `
    }

    const typeHandlers = {
      select: _getSelect.bind(this),
      insert: _getInsert.bind(this),
      update: _getUpdate.bind(this),
      delete: _getDelete.bind(this)
    }

    const requestType = type.toLowerCase()
    if (!(requestType in typeHandlers)) {
      throw `${requestType} not a valid type of request\n`
    } else {
      // je sais c'est sale mais c'est la seule fasons pour que
      // l'inheritance de variable soit faite
      const [fieldNames, fieldValues] = this._getFields()
  
      const fieldStatement = typeHandlers[requestType](fieldNames, fieldValues)
      const finalStatement =
        `${fieldStatement 
        } ${ 
        this._joinStatement 
        } ${ 
        this._whereStatement 
        } ${ 
        this._groupBy 
        }${this._order_by 
        }${this._limit 
        };`
      return [finalStatement, this._value_linker]
    }
  }
  
  _addWhereCondition(field, value, operator, type) {

    if (this._whereStatement === '') {
      this._whereStatement += 'WHERE '
    } else {
      this._whereStatement += `${type} `
    }
    const op = this[operator]
    if (typeof op === 'function') {
      op(field, value)
    } else {
      this._whereStatement += `${field} ${op} $${this._value_index} `
      this._value_index += 1
      this._value_linker.push(value)
    }
  }

  _getFields() {
    if (
      this._fieldValues.length === 0 ||
      this._fieldNames.length === this._fieldValues.length
    ) {
      return [this._fieldNames, this._fieldValues]
    }
    return -1
  }

  _range = (field, value) => {
    // un peu sale mais bon
    if (value.length !== 2) {
      throw '_range awaiting an array with two elements'
    }
    const statement =
      `${field} ` +
      `BETWEEN $${this._value_index} ` +
      `AND $${this._value_index + 1} `
    this._where_arg_values.push(value[0], value[1])
    // this._where_arg_values.push(value[0], value[1])
    this._value_index += 2
    this._whereStatement += statement
  }
}

/**
 *  EXEMPLE :
 *    - addAggregation and addFields:
 *      ```
 *        obj = new reqFormatter()
 *        obj.addFields({
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
 *          .addAggregation({
 *          field: {
 *            lastname: ["count", "avg"],
 *            firstname: "count"
 *          }
 *        })
 *        // outpout :
 *              SELECT AVG(COUNT(lastname)) AS jean, COUNT(firstname) AS jacque,
 *              username AS jejems FROM matcha  WHERE user_id <= $1  ;
 *
 *      - setOrderBy :
 *        obj.setOrderBy([['lastname', 'asc'], ['username', 'desc']])
 *        // outpout : ... ORDER BY lastname ASC, username DESC;
 *      ```
 *
 *
 *    - addAggregation and addFields:
 *      ```
 *        obj = new reqFormatter()
 *        obj.table = "users"
 *        obj.addFields({
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
 *      console.log(obj.generateQuery("select")[0])
 *      console.log(obj.generateQuery("select")[1])
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
 *      obj.addFields({
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
 *     console.log(obj.generateQuery("update"))
 *     OUTPOUT :
 *      [
 *        'UPDATE users SET lastname = $5,
 *         firstname = $6,
 *         username = $7
 *  WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND test <= $4  ;',
 *          [
 *            'abt', 'jejems', 'jeremie', 5, 'jean', 'jacque', 'jejems'
 *          ]
 *      ]
 *
 *
 *      console.log(obj.generateQuery("insert"))
 *      OUTPOUT :
 *      [
 *        'INSERT INTO users (lastname, firstname, username)
 *        VALUES ($5, $6, $7)
 *            WHERE lastname = $1 OR username = $2 AND firstname <= $3 AND test <= $4  ;',
 *          [
 *            'abt', 'jejems', 'jeremie', 5, 'jean', 'jacque', 'jejems'
 *          ]
 *      ]
 *
 *      console.log(obj.generateQuery("delete"))
 *      [
 *        'DELETE FROM users   WHERE lastname = $1 OR
 *          username = $2 AND firstname <= $3 AND test <= $4  ;',
 *        [ 'abt', 'jejems', 'jeremie', 5 ]
 *      ]
 *      ```
 *
 *
 */

const Obj = new reqFormatter()
Obj.addFields({
  firstnameplusweirdname: "firstname",
  anotherfieldname: "fieldname"
})
  .where({
    or: {
      eq: {
        firstname: "prout",
        jean: "jacque"
      }
    },
    and: {
      eq: {
        oui: "non",
        non: "oui"
      }
    }
  })
  .table = "users"

module.exports = reqFormatter
