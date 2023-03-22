export const jsonMergeExample = `{
  "id": 1,
  "uuid": "3d877494-e7d4-48e3-aa7a-164373a7920d",
  "name": "He3",
  "age": 26,
  "isActive": true,
  "registered": "2020-02-03T06:00:03 -08:00",
  "tags": [
    "tools",
    "development"
  ],
  "language": [
    {
      "id": 0,
      "name": "English"
    },
    {
      "id": 1,
      "name": "Español"
    },
    {
      "id": 2,
      "name": "Chinese"
    }
  ]
}`
export const jsonMergeExample2 = `{
  "id": 2,
  "uuid": "3d877494-e7d4-66aa-aa7a-164373a7920d",
  "name": "He3",
  "age": 36,
  "isActive": false,
  "registered": "2020-02-03T06:00:03 -08:00",
  "tags": [
    "tools",
    "development"
  ],
  "language": [
    {
      "id": 3,
      "name": "English"
    },
    {
      "id": 2,
      "name": "Español"
    },
    {
      "id": 1,
      "name": "Chinese"
    }
  ]
}`

export const yamlMergeExample = `
id: 1
uuid: 3d877494-e7d4-48e3-aa7a-164373a7920d
name: He3
age: 26
isActive: true
registered: 2020-02-03T06:00:03 -08:00
tags:
  - tools
  - development
language:
  - id: 0
    name: English
  - id: 1
    name: Español
  - id: 2
    name: Chinese`
