import { expect, test } from 'vitest'
import { secondsToHms } from './helpers'

test('returns "00 : 00" for 0 seconds', () => {
  expect(secondsToHms(0)).toBe('00 : 00')
})

test('returns "00 : 45" for 45 seconds', () => {
  expect(secondsToHms(45)).toBe('00 : 45')
})

test('returns "01 : 30" for 90 seconds', () => {
  expect(secondsToHms(90)).toBe('01 : 30')
})

test('returns "01 : 01 : 30" for 3690 seconds', () => {
  expect(secondsToHms(3690)).toBe('01 : 01 : 30')
})

test('returns "01 : 00" for 60 seconds', () => {
  expect(secondsToHms(60)).toBe('01 : 00')
})
