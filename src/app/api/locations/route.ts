import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { connectToDB } from '@/app/lib/database/mongodb'


// Tipos para os dados que você está manipulando
type City = {
    name: string
}

type State = {
    name: string
    cities: City[]
}

type Country = {
    name: string
    states: State[]
}

export async function GET() {
    try {
        await connectToDB()

        const db = mongoose.connection.db
        if (!db) 
        {
            throw new Error('Database connection is not available.')
        }
        
        const locations = await db.collection('locations').find().toArray()

        if (!locations.length) 
        {
            try 
            {
                if (!mongoose.connection || !mongoose.connection.db) 
                {
                    throw new Error('Database connection is not properly established')
                }
        
                const filePath = path.join(process.cwd(), 'data', 'countries+states+cities.json')
                const locations: Country[] = JSON.parse(fs.readFileSync(filePath, 'utf-8')) 
        
                const existingData = await mongoose.connection.db.collection('locations').findOne({})
                if (existingData) {
                    return NextResponse.json(
                        { message: 'Database already populated with location data' },
                        { status: 400 }
                    )
                }
        
                console.log("Inserting location data...")
                for (const country of locations) 
                {
                    const countryDoc = 
                    {
                        country_name: country.name,
                        states: country.states.map((state: State) => ({
                            state_name: state.name,  
                            cities: state.cities.map((city: City) => ({
                                city_name: city.name  
                            }))
                        }))
                    }
        
                    await mongoose.connection.db.collection('locations').insertOne(countryDoc)

                    const locations = await db.collection('locations').find().toArray()

                    return NextResponse.json({ locations }, { status: 200 })
                }
        
                return NextResponse.json(
                { message: 'Database populated successfully' },
                { status: 200 })
            } 
            catch (error) 
            {
                console.error('Error populating database:', error)
                return NextResponse.json(
                { message: 'Error populating the database', error: error },
                { status: 500 })
            }

        }
        return NextResponse.json({ locations }, { status: 200 })
    } 
    catch (error) 
    {
        return NextResponse.json({ message: 'Error fetching locations', error: error }, { status: 500 })
    }
}

