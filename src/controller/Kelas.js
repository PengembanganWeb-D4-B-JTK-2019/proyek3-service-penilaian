import * as PengajarDAO from '../dao/Pengajar'
import * as PerkuliahaDAO from '../dao/Perkuliahan'
import * as KelasDAO from '../dao/Kelas'

export const getKelasAjarByDosen = async (req, res, next) => {
  try {
    const nip = req.params.nip
    const pengajar = await PengajarDAO.findPengajarByNIP(nip)
    let i
    // let j
    const listIdPerkuliahan = []
    const listKelas = []
    for (i = 0; i < pengajar.length; i++) {
      const idPerkuliahan = pengajar[i].id_perkuliahan
      listIdPerkuliahan.push(idPerkuliahan)
    }
    for (i = 0; i < listIdPerkuliahan.length; i++) {
      const perkuliahan = await PerkuliahaDAO.findPerkuliahanById(listIdPerkuliahan[i])
      const kelas = await KelasDAO.findKelasByKodeKelas(perkuliahan.kode_kelas)
      listKelas.push(kelas)
    }
    const seen = new Set()
    const uniqueClass = listKelas.filter(data => {
      const duplicate = seen.has(data.kode_kelas)
      seen.add(data.kode_kelas)
      return !duplicate
    })
    res.status(200).json({
      message: 'get matkul by dosen sukses',
      data: {
        uniqueClass
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getListTahun = async (req, res) => {
  try {
    const kelas = await KelasDAO.findAllKelas()
    const listTahun = []
    let i
    for (i = 0; i < kelas.length; i++) {
      const tahun = kelas[i].tahun
      listTahun.push(tahun)
    }

    const listTahunUnique = listTahun.filter((c, index) => {
      return listTahun.indexOf(c) === index
    }).sort()

    res.status(200).json({
      message: 'get list tahun from tabel kelas sukses',
      data: {
        listTahunUnique
      }
    })
  } catch (error) {
    res.status(error.status).json({ error })
  }
}
