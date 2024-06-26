import {  UserEntity } from "src/user/entities/user.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export interface IMovieContructorParams {
    user: UserEntity,
    title: string,
    original_title: string,
    language_code: string,
    original_language_code: string,
    country_code: string
    duration_in_minutes: string,
    synopsis: string,
    release_date: string,
    genre: string[],
    rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'
    id?: string
}

@Entity({name: 'movie'})
export class MovieEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn()
    user: UserEntity

    @Column()
    user_id: string

    @Column({ length: 50 })
    title: string

    @Column({ length: 700 })
    synopsis: string

    @Column()
    original_title: string

    @Column()
    language_code: string

    @Column()
    original_language_code: string

    @Column()
    country_code: string

    @Column()
    duration_in_minutes: string

    @Column()
    release_date: string

    @Column('json')
    genre: string[]

    @Column()
    rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17'

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}

export class Movie extends MovieEntity {
    constructor(
        { title, original_title, language_code, original_language_code, country_code, user, synopsis, duration_in_minutes, release_date, genre, rating, id }: IMovieContructorParams
    ) {
        super()

        this.title = title
        this.user = user
        this.user_id = user.id
        this.synopsis = synopsis
        this.original_title = original_title
        this.language_code = language_code
        this.original_language_code = original_language_code
        this.country_code = country_code
        this.duration_in_minutes = duration_in_minutes
        this.release_date = release_date
        this.genre = genre
        this.rating = rating

        if (id) {
            this.id = id
        }
    }
}