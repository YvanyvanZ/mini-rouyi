const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const { item } = event
  
  try {
    // 检查是否已经收藏
    const checkResult = await db.collection('collections').where({
      _openid: wxContext.OPENID,
      itemId: item.id
    }).get()
    
    if (checkResult.data.length > 0) {
      return {
        success: false,
        message: '已经收藏过该内容'
      }
    }
    
    // 添加收藏
    const result = await db.collection('collections').add({
      data: {
        _openid: wxContext.OPENID, // 自动关联当前用户
        itemId: item.id,
        type: item.type,
        title: item.title,
        description: item.description,
        collectionDate: db.serverDate(), // 服务器时间
        // 其他字段根据类型存储
        ...(item.imageUrl && { imageUrl: item.imageUrl }),
        ...(item.price && { price: item.price }),
        ...(item.status && { status: item.status }),
        ...(item.lessonCount && { lessonCount: item.lessonCount }),
        ...(item.tags && { tags: item.tags }),
        ...(item.tag && { tag: item.tag }),
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      message: '收藏成功',
      data: result
    }
  } catch (error) {
    console.error('收藏失败:', error)
    return {
      success: false,
      message: '收藏失败',
      error: error
    }
  }
}