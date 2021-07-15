import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from 'body-parser'

// import keycloak from './middleware/keycloak'
import dosenRouter from './routes/Dosen'
import mahasiswaRouter from './routes/Mahasiswa'
import userRouter from './routes/User'
import nilaiRouter from './routes/Nilai'
import kategoriNilaiRouter from './routes/Kategori_Nilai'
import nilaiAkhirRouter from './routes/Nilai_Akhir'
import penilaianRouter from './routes/Penilaian'


const app = express()
app.use(cors())
// Non aktifkan dulu keycloak agar tidak ada validasi token
// app.use(keycloak.middleware())
// app.use(keycloak.protect())
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/dosen', dosenRouter)
app.use('/mahasiswa', mahasiswaRouter)
app.use('/user', userRouter)
app.use('/nilai', nilaiRouter)
app.use('/kategori-nilai', kategoriNilaiRouter)
app.use('/nilai-akhir', nilaiAkhirRouter)
app.use('/penilaian', penilaianRouter)


// error handling
app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const cause = error.cause || 'Internal Server Error'
  res.status(status).json({
    message: message,
    error: status,
    cause: cause
  })
})

export default app
