import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

const archiveSchema = new Schema({
  
  id: Number ,
  masalah: String, 
  nomor_surat: String ,
  tgl_surat: String,
  jenis_naskah: String ,
  pejabat_penanda_tangan: String ,
  jumlah_berkas: String ,
  tingkat_perkembangan: String ,
  no_boks: Number ,
  keterangan: String ,
  user_id: {
    type: Schema.ObjectId ,
    ref: 'User'
  }
  
} , {timestamps: true} , {collections: 'archive'})

archiveSchema.plugin(mongoosePaginate)

archiveSchema.index({ masalah: 'text' , jenis_naskah: 'text' , tingkat_perkembangan : 'text' , keterangan: 'text' })

var archiveModel = mongoose.model('Archive' , archiveSchema)

export default archiveModel