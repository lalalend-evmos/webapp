enum Path {
  ROOT = '/',
  MIA = '/mia',
  MARKETS = '/markets',
  MARKET_DETAILS = '/market/:nTokenId',
  HISTORY = '/history',
  VAULTS = '/vaults',
  GOVERNANCE = '/governance',
  GOVERNANCE_LEADER_BOARD = '/governance/leaderboard',
  GOVERNANCE_PROPOSAL_DETAILS = '/governance/proposal/:id',
  GOVERNANCE_ADDRESS = '/governance/address/:address',
  CONVERT_VRT = '/convert-vrt',
  SEB = '/seb',
  SWAP= '/swap',
  ANALYTICS = '/analytics'
}

export default Path;
