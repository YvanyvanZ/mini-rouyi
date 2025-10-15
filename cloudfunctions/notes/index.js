// 云开发版本的服务层
class NoteService {
  constructor() {
    this.db = wx.cloud.database();
    this.collection = this.db.collection('notes');
  }

  // 获取笔记详情
  async getNoteDetail(noteId) {
    try {
      const result = await this.collection.doc(noteId).get();
      return result.data;
    } catch (error) {
      console.error('获取笔记详情失败:', error);
      throw error;
    }
  }

  // 保存笔记
  async saveNote(noteData) {
    try {
      const now = new Date();
      const note = {
        ...noteData,
        updatedAt: now,
        createdAt: noteData.createdAt || now
      };

      if (note._id) {
        // 更新现有笔记
        const { _id, ...updateData } = note;
        await this.collection.doc(_id).update({
          data: updateData
        });
        return _id;
      } else {
        // 创建新笔记
        const result = await this.collection.add({
          data: note
        });
        return result._id;
      }
    } catch (error) {
      console.error('保存笔记失败:', error);
      throw error;
    }
  }

  // 上传图片
  async uploadImage(filePath) {
    try {
      // 生成唯一文件名
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const cloudPath = `notes/images/${timestamp}-${randomStr}.jpg`;

      const uploadResult = await wx.cloud.uploadFile({
        cloudPath,
        filePath,
      });

      return uploadResult.fileID;
    } catch (error) {
      console.error('上传图片失败:', error);
      throw error;
    }
  }

  // 批量上传图片
  async uploadImages(filePaths) {
    try {
      const uploadPromises = filePaths.map(filePath => this.uploadImage(filePath));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('批量上传图片失败:', error);
      throw error;
    }
  }

  // 删除图片
  async deleteImage(fileID) {
    try {
      await wx.cloud.deleteFile({
        fileList: [fileID]
      });
    } catch (error) {
      console.error('删除图片失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const noteService = new NoteService();

// 导出方法
export const getNoteDetail = (noteId) => noteService.getNoteDetail(noteId);
export const saveNote = (noteData) => noteService.saveNote(noteData);
export const uploadImage = (filePath) => noteService.uploadImage(filePath);
export const uploadImages = (filePaths) => noteService.uploadImages(filePaths);
export const deleteImage = (fileID) => noteService.deleteImage(fileID);

export default noteService;