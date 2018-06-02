import bcrypt from 'bcrypt'
import User from '../models/user'
import Archive from '../models/archive'
var pagination = require('pagination');

var session
var query_search 

export default {
  index: (req , res , next) => {  
    console.log('from home' , session)
    User.find({} , function(err , user) {
      if (err) {
        console.log(err)
      } else {
        Archive.find({})
          .populate('user_id')
          .sort([['updatedAt' , 'descending']])
          .limit(7)
          .exec(function(err , archive) {
            if (err) {
              console.log(err)
            } else {
              res.render('index', {
                title: 'Express' ,
                user: session ,
                user_length: user.length ,
                archive ,
                archive_length: archive.length
              });
            }
          })
      }
    })

  } ,
  arsip: (req , res , next) => {
    var perPage = 5
    var page = req.query.page || 1
    page = parseInt(page)
    var offset = (page - 1) * perPage
    var pageStart = page
    var lastPage = 4 + pageStart
    var isSearch = false
    console.log(query_search)
    User.find({} , function(err , user) {
      if (err) {
        console.log(err)
      } else {
        if (req.query.search) {
          isSearch = true
          var search = req.query.search
          console.log('Search' , req.query.search)
          // add this if you want search value from the input search
          // $text: {$search: req.query.search}
          Archive.find({})
            .populate('user_id') 
            .sort([['updatedAt', 'descending']])
            .exec(function(err , archive) {
              Archive.count().exec(function(err , count) {
                console.log(count , page)
                return res.render('arsip/index' , {
                  user: session ,
                  archive ,
                  page ,
                  pages: count / perPage ,
                  pageStart ,
                  lastPage ,
                  isSearch ,
                  offset ,
                  search ,
                  query_search
                })
                query_search = null
              })
            })
        } else {
          isSearch = false
          Archive.find({})
            .populate('user_id')
            // uncomment this if you make manual pagination
            // .limit(perPage)
            .skip(offset)
            // .sort({createdAt: 1})
            .sort([['updatedAt', 'descending']])
            .exec(function(err , archive) {
              Archive.count().exec(function(err , count) {
                console.log(count , page)
                var bootstrapPaginator = new pagination.TemplatePaginator({
                    prelink:'/arsip', current: page, rowsPerPage: 5,
                    totalResult: count,
                    template: function(result) {
                        var i, len, prelink;
                        var html = '<div><ul class="pagination">';
                        if(result.pageCount < 2) {
                            html += '</ul></div>';
                            return html;
                        }
                        prelink = this.preparePreLink(result.prelink);
                        if(result.previous) {
                            html += '<li class="page-item"><a class="page-link" href="' + prelink + result.previous + '">&laquo;</a></li>';
                        }
                        if(result.range.length) {
                            for( i = 0, len = result.range.length; i < len; i++) {
                                if(result.range[i] === result.current) {
                                    html += '<li class="page-item active"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                                } else {
                                    html += '<li class="page-item"><a class="page-link" href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
                                }
                            }
                        }
                        if(result.next) {
                            html += '<li class="page-item"><a class="page-link" href="' + prelink + result.next + '" class="paginator-next">&raquo;</a></li>';
                        }
                        html += '</ul></div>';
                        return html;
                    }
                });
                return res.render('arsip/index' , {
                  user: session ,
                  archive ,
                  page ,
                  pages: count / perPage ,
                  pageStart ,
                  lastPage ,
                  isSearch ,
                  offset ,
                  query_search ,
                  paginator: bootstrapPaginator.render()
                })
                query_search = null
              })
            })
          }
        }
    })
  } ,
  arsipData: (req , res , next) => {
    Archive.find({} , {
        _id: '' ,
        masalah: '' ,
        no_tgl_surat: '' ,
        jenis_naskah: '' ,
        pejabat_penanda_tangan: '' ,
        tingkat_perkembangan: '' ,
        user_id: ''
      })
      .populate('user_id' , 'username')
      .exec((err , result) => res.json(result))
  } ,
  search: (req , res , next) => {
    query_search = req.query.search
    res.redirect('/arsip')
  } ,
  addArsipView: (req , res , next) => {
    if (req.session.user) {
      res.render('arsip/add' , {
        user: session
      })
    } else {
      res.redirect('/')
    }
  } ,
  addArsip: (req , res) => {
    if (req.body !== '') {
      var newArchive = new Archive()
      newArchive.masalah = req.body.masalah
      newArchive.nomor_surat = req.body.nomor_surat
      newArchive.tgl_surat = req.body.tgl_surat
      newArchive.jenis_naskah = req.body.jenis_naskah 
      newArchive.pejabat_penanda_tangan = req.body.pejabat_penanda_tangan
      newArchive.jumlah_berkas = req.body.jumlah_berkas
      newArchive.tingkat_perkembangan = req.body.tingkat_perkembangan 
      newArchive.no_boks = req.body.no_boks 
      newArchive.user_id = req.session.user._id

      newArchive.save(function(err , result) {
        if (err) {
          console.log(err)
        } else {
          res.redirect('/arsip')
          console.log(result)
        }
      })
    } else {
      console.log('tidak boleh kosong')
    }
  } ,
  viewArsip: (req , res , next) => {
    Archive.findOne({ _id: req.params.id } , function(err , result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.json(result)
        // res.render('arsip/single' , {
        //   user: session
        // })
      }
    })
  } ,
  editArsip: (req , res , next) => {
    if (req.session.user) {
      Archive.findOne({ _id: req.params.id } , function(err , result) {
        if (err) {
          console.log(err)
        } else {
          console.log(result)
          res.render('arsip/edit' , {
            arsip: result ,
            user: session
          })
        }
      })
    } else {
      res.redirect('/')
    }
  } ,
  updatearsip: (req , res , next) => {
    var id = req.params.id
    var query = {
     masalah: req.body.masalah ,
     tgl_surat: req.body.tgl_surat ,
     nomor_surat: req.body.nomor_surat ,
     jenis_naskah: req.body.jenis_naskah  ,
     pejabat_penanda_tangan: req.body.pejabat_penanda_tangan ,
     jumlah_berkas: req.body.jumlah_berkas ,
     tingkat_perkembangan: req.body.tingkat_perkembangan  ,
     no_boks: req.body.no_boks  ,
     user_id: req.session.user._id
    }
    Archive.findByIdAndUpdate(id , query , (err , result) => {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.redirect('/arsip')
      }
    })
  } ,
  deleteData: (req , res , next) => {
    var id = req.body._id
    Archive.findByIdAndRemove(id , (err , result) => {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.redirect('/arsip')
      }
    })
  } ,
  regulasi: (req , res , next) => {
    res.render('regulasi/regulasi' , {
      user: session
    })
  } ,
  smep: (req , res , next) => {
    res.render('smep/index' , {
      user: session
    })
  } ,
  profile: (req , res , next) => {
    if (req.session.user) {
        User.find({} , function(err , user) {
          res.render('profile/index' , {
            user: session
          })
        })
    } else {
      res.redirect('/')
    }
  } ,
  login: (req , res , next) => {
    User.findOne({ username: req.body.username } , function(err, user) {
      console.log(user)
      if (!user) {
        console.log('not user')
        res.redirect('/login')
      } else {
        console.log(user)
        var compare = bcrypt.compareSync(req.body.password , user.password) 
        if (!compare) {
          console.log('wrong password')
          res.redirect('/login')
        } else {
          console.log('success login')
          req.session.user = user;
          session = req.session.user;
          res.redirect('/')
        }
      }
    })
  } ,
  logout: (req , res , next) => {
    req.session.destroy()
    session = null
    res.redirect('/')
  }
}