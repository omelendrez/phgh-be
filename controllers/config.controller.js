const { Config } = require('../models')
const { Audit } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const get = (req, res) => {
    const query = 'SELECT * FROM `Configs` as `Config`;'
    const result = { success: true }
    Config
        .sequelize
        .query(query)
        .then(data => {
            Object.assign(result, { config: data[0] })
            res.json(result)
        })
        .catch(err => ReE(res, err))
}
module.exports.get = get

const update = async function (req, res) {
    let { fieldName, value } = req.body
    switch (typeof (value)) {
        case 'boolean':
            value = value ? 1 : 0
            break
    }
    const data = {
        [fieldName]: value
    }
    const field = {
        fields: [fieldName]
    }
    Config.findOne({ where: { id: 1 } })
        .then(config => {
            config.update(data, field)
                .then(config => {
                  const audit = {
                    userId: req.user.id,
                    model: 'configs',
                    recordId: config.id,
                    field: fieldName,
                    value: value.toString()
                  }
                  Audit.create(audit)
                  ReS(res, { message: 'Config updated successfully', config: config.toWeb() }, 201)
                })
                .catch(() => ReE(res, 'Error occured trying to update configuration field'))
        })
}
module.exports.update = update
