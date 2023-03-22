import forge from 'node-forge'

const encrypt = ({
  keyBitsValue,
  countryValue,
  domainValue,
  stateValue,
  localityValue,
  organizationValue,
  unitValue,
  expireValue,
}: {
  keyBitsValue: number
  countryValue: string
  domainValue: string
  stateValue: string
  localityValue: string
  organizationValue: string
  unitValue: string
  expireValue: number
}) => {
  let pki = forge.pki
  let keys = pki.rsa.generateKeyPair(keyBitsValue)
  let cert = pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = '01'
  let attrs = [
    {
      name: 'countryName',
      value: countryValue,
    },
    {
      name: 'commonName',
      value: domainValue,
    },
    {
      shortName: 'ST',
      value: stateValue,
    },
    {
      name: 'localityName',
      value: localityValue,
    },
    {
      name: 'organizationName',
      value: organizationValue,
    },
    {
      shortName: 'OU',
      value: unitValue,
    },
  ]
  cert.validity.notBefore = new Date()

  let expired = new Date()
  expired.setDate(expired.getDate() + expireValue)
  cert.validity.notAfter = expired
  cert.setSubject(attrs)
  cert.setIssuer(attrs)
  cert.sign(keys.privateKey)
  return pki.certificateToPem(cert)
}

onmessage = (value) => {
  postMessage(encrypt(value.data))
}
