import multer from 'multer'
 
// メモリに一時保存してCloudinaryに渡す
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    
    //画像以外弾く
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('画像ファイルのみアップロード可能です'))
    }
  },
})
 
export default upload