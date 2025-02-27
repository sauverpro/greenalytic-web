import { getAggregatedEmissionData } from "../../services/emmissionService/emissionService.js"

export const fetchEmissionData = async (req, res) => {
  try {
    const { page, limit, startDate, endDate } = req.pagination
    const emissionData = await getEmissionData(page, limit, startDate, endDate)

    res.status(200).json(emissionData)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
export const fetchAggregatedEmissionData = async (req, res) => {
  try {
    const { page, limit, startDate, endDate, interval } = req.pagination
    const aggregatedEmissionData = await getAggregatedEmissionData(
      page,
      limit,
      startDate,
      endDate,
      interval
    )

    res.status(200).json(aggregatedEmissionData)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
