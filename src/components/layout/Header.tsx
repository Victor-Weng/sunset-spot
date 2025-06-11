'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useWeather } from '@/hooks/useWeather'
import { useSunsetTime } from '@/hooks/useSunsetTime'

export function Header() {
  const { user, logout } = useAuth()
  const { weather, loading: weatherLoading } = useWeather()
  const { sunsetTime, loading: sunsetLoading } = useSunsetTime()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-sunset">Sunset Social</span>
            </Link>
          </div>

          {/* Weather and Sunset Time */}
          <div className="flex items-center space-x-4">
            {!weatherLoading && weather && (
              <div className="flex items-center">
                <Image
                  src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  width={40}
                  height={40}
                />
                <span className="ml-2">{Math.round(weather.temp)}°C</span>
              </div>
            )}
            {!sunsetLoading && sunsetTime && (
              <div className="text-sm text-gray-600">
                Sunset: {sunsetTime.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:text-sunset"
                >
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name || 'User avatar'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">
                        {user.name?.[0] || user.email[0]}
                      </span>
                    </div>
                  )}
                  <span>{user.name || user.email}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="text-gray-600 hover:text-sunset"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-sunset"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-sunset text-white px-4 py-2 rounded-md hover:bg-sunset-dark"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 