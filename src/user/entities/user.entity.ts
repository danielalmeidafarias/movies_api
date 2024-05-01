import { Movie } from "src/movies/entities/movie.entity"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

@Entity()
export class User {
    constructor(email: string, password: string, id?: string) {
        this.email = email
        this.password = password
        this.id = id
    }

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Unique('email', ['email'])
    email: string

    @Column()
    password: string

    @OneToMany(() => Movie, movie => movie.user_id)
    movies: Movie[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}