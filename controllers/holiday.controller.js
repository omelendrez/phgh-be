const { Holiday } = require('../models')
const { ReE, ReS } = require('../services/util.service')

const create = async function (req, res) {
  const data = req.body
  Holiday.create(data)
    .then(holiday => ReS(res, {
      message: 'Holiday successfully created',
      holiday: holiday.toWeb()
    }, 201))
    .catch(() => ReE(res, 'Error occured trying to create holiday'))
}
module.exports.create = create

const update = async function (req, res) {
  const data = req.body
  Holiday.findOne({ where: { id: req.params.id } })
    .then(holiday => holiday.update({
      title: data.title
    })
    )
    .then(holiday => {
      ReS(res, { message: `Holiday "${holiday.title}" updated successfully`, holiday: holiday.toWeb() }, 200)
    })
    .catch(() => ReE(res, 'Error occured trying to update holiday'))
}
module.exports.update = update

const remove = async function (req, res) {
  Holiday.findOne({ where: { id: req.params.id } })
    .then(holiday => holiday.destroy())
    .then(holiday => {
      ReS(res, { message: `Holiday "${holiday.title}" updated deleted`, holiday: holiday.toWeb() }, 200)
    })
    .catch(() => ReE(res, 'Error occured trying to delete holiday'))
}
module.exports.remove = remove

const getAll = (req, res) => {
  const query =
    'SELECT `id`, `date`, `title` FROM `holidays`; '
  const result = { success: true }
  Holiday.sequelize
    .query(query)
    .then(data => {
      Object.assign(result, { holidays: data[0] })
      res.json(result)
    })
    .catch(err => ReE(res, err))
}
module.exports.getAll = getAll
