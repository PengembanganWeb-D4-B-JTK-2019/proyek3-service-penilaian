import * as PengajarDAO from '../dao/Pengajar'
import * as PerkuliahaDAO from '../dao/Perkuliahan'
import * as MatkulDAO from '../dao/Mata Kuliah'
// import * as KelasDAO from '../dao/Kelas'
import expressValidator from 'express-validator/check'
const { validationResult } = expressValidator

export const getMatkulAjarByDosen = async (req, res) => {
  try {
    const nip = req.params.nip
    const idKelas = req.params.id_kelas
    const pengajar = await PengajarDAO.findPengajarByNIP(nip)
    let i
    const idPerkuliahan = []
    const listIdPerkuliahan = []
    const listMatkul = []
    for (i = 0; i < pengajar.length; i++) {
      const idPerkuliahan = pengajar[i].id_perkuliahan
      listIdPerkuliahan.push(idPerkuliahan)
    }
    for (i = 0; i < listIdPerkuliahan.length; i++) {
      const perkuliahan = await PerkuliahaDAO.findPerkuliahanById(listIdPerkuliahan[i])
      if (perkuliahan.kode_kelas === idKelas) {
        const matkul = await MatkulDAO.findMatkulById(perkuliahan.id_mata_kuliah)
        listMatkul.push(matkul)
        idPerkuliahan.push(perkuliahan.id)
      }
    }
    res.status(200).json({
      message: 'get matkul by dosen sukses',
      data: {
        listMatkul,
        idPerkuliahan
      }
    })
  } catch (error) {
    res.status(error.status).json({ error })
  }
}

export const getListSemester = async (req, res) => {
  try {
    const matkul = await MatkulDAO.findAllMatkul()
    const listSemester = []
    let i
    for (i = 0; i < matkul.length; i++) {
      const semester = matkul[i].semester
      listSemester.push(semester)
    }

    const listSemesterUnique = listSemester.filter((c, index) => {
      return listSemester.indexOf(c) === index
    }).sort()

    res.status(200).json({
      message: 'get list semester from tabel semester sukses',
      data: {
        listSemesterUnique
      }
    })
  } catch (error) {
    res.status(error.status).json({ error })
  }
}


export const postNewMatkul = async (req, res, next) => {
  try {
    const error = validationResult(req)
    if (!error.isEmpty()) {
      error.status = 400
      throw error
    }

    const {
      id,
      semester,
      namaMataKuliah,
      sksTeori,
      sksPraktik,
      kodeProgramStudi
    } = req.body

    const matkul = await MatkulDAO.insertOneMatkul(
      id,
      semester,
      namaMataKuliah,
      sksTeori,
      sksPraktik,
      kodeProgramStudi
    )

    if (typeof matkul === 'undefined') {
      error.status = 500
      error.message = 'Insert Matkul gagal'
      throw error
    }

    res.status(200).json({
      message: 'insert matkul sukses',
      data: {
        matkul
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getAllMatkul = async (req, res, next) => {
  try {
    const matkul = await MatkulDAO.findAllMatkul()
    res.status(200).json({
      message: 'get all matkul success',
      data: {
        matkul
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getOneMatkulById = async (req, res, next) => {
  try {
    const { id } = req.params
    const matkul = await MatkulDAO.findMatkulById(id)
    res.status(200).json({
      message: 'get one Matkul by Id success',
      data: {
        matkul
      }
    })
  } catch (error) {
    next(error)
  }
}

export const deleteMatkulbyId = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await MatkulDAO.deleteMatkulbyId(id)
    if (result === 1) {
      res.status(200).json({
        message: 'Delete matkul berhasil',
        data: {
          id
        }
      })
    } else {
      const error = new Error('Delete matkul gagal')
      error.statusCode = 500
      throw error
    }
  } catch (error) {
    next(error)
  }
}

export const updateDataMatkulById = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      semester,
      namaMataKuliah,
      sksTeori,
      sksPraktik,
      kodeProgramStudi
    } = req.body
    const updateMatkul = await MatkulDAO.updateDataMatkul(
      id,
      semester,
      namaMataKuliah,
      sksTeori,
      sksPraktik,
      kodeProgramStudi
    )
    if (updateMatkul === 1) {
      const matkul = await MatkulDAO.findMatkulById(id)
      res.status(200).json({
        message: 'Update data Matkul berhasil',
        data: {
          matkul
        }
      })
    } else {
      const error = new Error('Update data Matkul gagal')
      error.statusCode = 500
      error.cause = 'Update data Matkul gagal'
      throw error
    }
  } catch (error) {
    next(error)
  }
}