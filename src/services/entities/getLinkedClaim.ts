import { getMappedNewURL } from 'new-utils'
import { serviceEndpointToUrl } from 'utils/entities'

export const getLinkedClaim = async ({ claim, service }: { claim: any; service: any }) => {
  const url = serviceEndpointToUrl(claim.serviceEndpoint, service)

  if (claim.proof && url) {
    return fetch(getMappedNewURL(url))
      .then((response) => response.json())
      .then((response) => {
        return response.entityClaims[0]
      })
      .then((response) => {
        return { [response.id]: { ...response, linkedClaimId: claim.id } }
      })
      .catch(() => undefined)
  }
}
