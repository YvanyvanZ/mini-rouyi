// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  const { itemId } = event
  
  try {
    // 从收藏集合中删除指定项目
    const result = await db.collection('collections').where({
      _openid: wxContext.OPENID, // 只能删除自己的收藏
      itemId: itemId
    }).remove()
    
    console.log('取消收藏结果:', result)
    
    return {
      success: true,
      message: '取消收藏成功',
      data: result
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
    return {
      success: false,
      message: '取消收藏失败',
      error: error
    }
  }
}