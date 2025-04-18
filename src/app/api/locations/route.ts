import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { connectToDB } from '@/app/lib/database/mongodb'

type City = { name: string }
type State = { name: string; cities: City[] }
type Country = { name: string; states: State[] }

export async function GET() {
    try {
        await connectToDB()
        const db = mongoose.connection.db

        if (!db) {
            throw new Error('Database connection is not available.')
        }

        const existingLocations = await db.collection('locations').find().toArray()

        if (existingLocations.length > 0) {
            return NextResponse.json({ locations: existingLocations }, { status: 200 })
        }

        // Se não tiver dados, tenta popular
        const filePath = path.join(process.cwd(), 'data', 'countries+states+cities.json')
        const fileData: Country[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

        const alreadyPopulated = await db.collection('locations').findOne({})
        if (alreadyPopulated) {
            return NextResponse.json(
                { message: 'Database already populated with location data' },
                { status: 400 }
            )
        }

        const docs = fileData.map((country) => ({
            country_name: country.name,
            states: country.states.map((state) => ({
                state_name: state.name,
                cities: state.cities.map((city) => ({ city_name: city.name }))
            }))
        }))

        await db.collection('locations').insertMany(docs)

        const newLocations = await db.collection('locations').find().toArray()

        return NextResponse.json({ locations: newLocations }, { status: 200 })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json({ message: 'Error processing locations', error }, { status: 500 })
    }
}
