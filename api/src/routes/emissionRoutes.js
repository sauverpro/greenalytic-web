import express from 'express'

import { fetchAggregatedEmissionData, fetchEmissionData } from '../controllers/emissionController/emissionController.js'
import paginationMiddleware from '../middlewares/paginationMiddleware.js'

const emissionRouter = express.Router()

// Get emission data with pagination & optional time filtering
emissionRouter.get('/emissions', paginationMiddleware, fetchEmissionData)
// Get aggregated emission data (with time interval filtering)
emissionRouter.get(
  '/aggregated-emissions',
  paginationMiddleware,
  fetchAggregatedEmissionData
)
export default emissionRouter
