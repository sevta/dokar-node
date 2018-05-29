import csv from 'csvtojson'
import bcrypt from 'bcrypt'
import User from '../models/user'
import Archive from '../models/archive'
import fast_csv from 'fast-csv'

export default {
  index: (req , res , next) => {
    if (req.session.user) {
      User.find({} , function(err , user) {
        if (err) {
          console.log(err)
        } else {
          Archive.find({})
            .populate('user_id')
            .exec(function(err , archive) {
               console.log('archive ===========' , archive)
                console.log('archive ===========' , archive.username)
                res.render('_admin/index' , {
                  user ,
                  archive
                })
             })
          }
      })
    } else {
      console.log('youre not loged in')
      res.redirect('/')
    }
  } ,
  handleCsv: (req , res , next) => {
    var path = req.file.path
    var obj
    csv().fromFile(path , function(err , result) {
      if (err) {
        console.log('err' , err)
      } 
      var json = result
      res.json(result)
    })
  } ,

  seedUsers: (req , res , next) => {
    var path = 'usersCSV/6335a3cdc1b627041275b2c2655c01fc'
    csv().fromFile(path , function(err , result) {
      var json = result 
      console.log(result)
      for (var i = 0; i < result.length; i++) {
        var users_obj = result[i].field2.replace(/^[, ]+|[, ]+$|[, ]+/g, " ").trim().replace(/\s/g, '').replace(/\./g, "").toLowerCase()
        var new_user = {
          username: users_obj ,
          password: bcrypt.hashSync(users_obj , bcrypt.genSaltSync(10)) ,
          status: 2
        }
        var new_users = new User(new_user)
        new_users.save(function(err , result) {
          if (err) { console.log(err) }
        })
      }
    })
  } ,

  handleArchive: (req , res , next) => {
    console.log(req.file)
    var path = 'usersCSV/6335a3cdc1b627041275b2c2655c01fc'
    var csv_string = req.file.buffer.toString()
    var done = false
    var archives = []
    if (csv_string === undefined) {
      res.redirect('/')
    }
    csv()
      .fromString(csv_string , function(err , json) {
        console.log(json[0].JENIS_NASKAH_DINAS)
        
        json.map(function(obj , i) {
          var newArchive = new Archive()
          newArchive.id = i 
          newArchive.no_tgl_surat = null 
          newArchive.masalah = obj.MASALAH 
          newArchive.jenis_naskah = obj.JENIS_NASKAH_DINAS 
          newArchive.pejabat_penanda_tangan = obj.PEJABAT_PENANDA_TANGAN 
          newArchive.tingkat_perkembangan = obj.TINGKAT_PERKEMBANGAN 
          newArchive.jumlah_berkas = 1 
          newArchive.no_boks = obj.NO_BOKS 
          newArchive.user_id = req.session.user._id
          archives.push(newArchive)
          console.log('archives' , archives)
        })

        Archive.insertMany(archives , function(err , result) {
          if (err) {
            console.log(err)
          } else {
            console.log('result' , result)
            return res.redirect('/arsip')
          }
        })
        
        // newArchive.save(function(err) {
        //   if (err) {
        //     console.log(err)
        //   } else {
        //      return res.redirect('/arsip')
        //    }
        // })

      })
  }
}