import { Movie, MovieEntity } from "src/movies/entities/movie.entity"
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

export interface IUserContructorParameter {
    email: string,
    password: string
    id?: string
}

@Entity({name: 'user'})
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Unique('email', ['email'])
    email: string

    @Column()
    password: string

    @OneToMany(() => MovieEntity, movie => movie.user)
    movies: MovieEntity[]

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}

export class User extends UserEntity {
    constructor({ email, password, id }: IUserContructorParameter) {
        super()
        this.email = email
        this.password = password

        if (id) {
            this.id = id
        }
    }
}
