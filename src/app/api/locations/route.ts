import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { connectToDB } from '@/app/lib/database/mongodb';


// Tipos para os dados que você está manipulando
type City = {
    name: string;
};

type State = {
    name: string;
    cities: City[];
};

type Country = {
    name: string;
    states: State[];
};

export async function POST() {
    try {
        // Conectar ao banco de dados usando sua função
        await connectToDB();

        // Garantir que a conexão esteja estabelecida
        if (!mongoose.connection || !mongoose.connection.db) {
            throw new Error('Database connection is not properly established');
        }

        // Ler o arquivo JSON com os dados de países, estados e cidades
        const filePath = path.join(process.cwd(), 'data', 'countries+states+cities.json'); // Caminho correto
        const locations: Country[] = JSON.parse(fs.readFileSync(filePath, 'utf-8')); // Agora estamos tipando o JSON lido

        // Verificar se os dados já foram inseridos
        const existingData = await mongoose.connection.db.collection('locations').findOne({});
        if (existingData) {
            return NextResponse.json(
                { message: 'Database already populated with location data' },
                { status: 400 }
            );
        }

        // Inserir os dados no banco de dados
        console.log("Inserting location data...");
        for (const country of locations) {
            const countryDoc = {
                country_name: country.name,  // Apenas o nome do país
                states: country.states.map((state: State) => ({
                    state_name: state.name,  // Apenas o nome do estado
                    cities: state.cities.map((city: City) => ({
                        city_name: city.name  // Apenas o nome da cidade
                    }))
                }))
            };

            await mongoose.connection.db.collection('locations').insertOne(countryDoc);
        }

        return NextResponse.json(
            { message: 'Database populated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error populating database:', error);
        return NextResponse.json(
            { message: 'Error populating the database', error: error },
            { status: 500 }
        );
    }
}



export async function GET() {
    try {
        await connectToDB();

        // Garantir que a conexão com o banco de dados está ativa
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not available.');
        }
        
        // Buscar todas as locations no banco
        const locations = await db.collection('locations').find().toArray();

        if (!locations.length) {
            return NextResponse.json({ message: 'No locations found' }, { status: 404 });
        }

        return NextResponse.json({ locations }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching locations', error: error }, { status: 500 });
    }
}

