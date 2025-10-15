const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const { type } = event // 可选的类型过滤
  
  try {
    let query = db.collection('collections').where({
      _openid: wxContext.OPENID
    })
    
    // 如果有类型过滤，添加类型条件
    if (type && type !== 'all') {
      query = query.where({
        type: type
      })
    }
    
    // 按收藏时间倒序排列
    const result = await query.orderBy('collectionDate', 'desc').get()
    
    return {
      success: true,
      data: result.data,
      total: result.data.length
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    return {
      success: false,
      message: '获取收藏列表失败',
      error: error
    }
  }
}