const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()

// 通用添加数据
exports.addData = async (collection, data) => {
  try {
    const result = await db.collection(collection).add({
      data: {
        ...data,
        createTime: new Date(),
        updateTime: new Date(),
        _openid: cloud.getWXContext().OPENID
      }
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error }
  }
}

// 通用查询数据
exports.getData = async (collection, where = {}, orderBy = { field: 'createTime', order: 'desc' }) => {
  try {
    let query = db.collection(collection).where(where)
    
    if (orderBy.field) {
      query = query.orderBy(orderBy.field, orderBy.order)
    }
    
    const result = await query.get()
    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error }
  }
}

// 通用更新数据
exports.updateData = async (collection, id, data) => {
  try {
    const result = await db.collection(collection).doc(id).update({
      data: {
        ...data,
        updateTime: new Date()
      }
    })
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error }
  }
}

// 通用删除数据
exports.deleteData = async (collection, id) => {
  try {
    const result = await db.collection(collection).doc(id).remove()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error }
  }
}