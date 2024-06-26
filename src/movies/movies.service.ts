import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieBodyDTO } from './dto/update-movie.dto';
import { Repository } from 'typeorm';
import { Movie, MovieEntity } from './entities/movie.entity';
import { MoviesRepository } from './movies.repository';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/user/user.repository';
import { PartialType } from '@nestjs/mapped-types';
import { SearchMovieQueryDTO } from './dto/search-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MoviesRepository) private movieRepository: MoviesRepository,
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserRepository) private userRepository: UserRepository,
  ) { }

  async create(createMovieDto: CreateMovieDto) {
    const {
      access_token,
      title,
      original_title,
      language_code,
      original_language_code,
      country_code,
      duration_in_minutes,
      genre,
      rating,
      release_date,
      synopsis,
    } = createMovieDto;

    const { id: user_id } = await this.authService.decodeToken(access_token);
    const user = await this.userRepository.findOneById(user_id);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { id } = (
      await this.movieRepository.create(
        new Movie({
          duration_in_minutes,
          genre,
          language_code,
          original_language_code,
          country_code,
          original_title,
          rating,
          release_date,
          synopsis,
          title,
          user,
        }),
      )
    ).identifiers[0];

    return await this.findOne(id);
  }

  async search(moviesFilter: SearchMovieQueryDTO) {
    return await this.movieRepository.search(moviesFilter)
  }

  async findOne(movie_id: string) {
    const movie = await this.movieRepository.getOne(movie_id);

    if (!movie) {
      throw new HttpException(
        'movie_id does not correspond to any movie',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return movie
    }
  }

  async update(
    movie_id: string,
    updateMovieDto: UpdateMovieBodyDTO,
  ) {
    const { id: user_id } = await this.authService.decodeToken(updateMovieDto.access_token);

    const movie = await this.movieRepository.getOne(movie_id);

    if (!movie) {
      throw new HttpException(
        'movie_id does not correspond to any movie',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (movie.user_id !== user_id) {
      throw new UnauthorizedException();
    }

    let updated_movie: Partial<Movie> = {
      id: movie_id
    }

    for (const prop in updateMovieDto) {
      if (updateMovieDto[prop] !== movie[prop] && prop !== 'access_token') {
        updated_movie[prop] = updateMovieDto[prop]
      }
    }

    if (Object.keys(updated_movie).length < 2) {
      throw new HttpException('None change was requested', HttpStatus.BAD_REQUEST)
    }

    await this.movieRepository.update(updated_movie);

    return await this.movieRepository.getOne(movie_id);

  }

  async remove(movie_id: string, access_token: string) {
    const { id: user_id } = await this.authService.decodeToken(access_token);

    const user = await this.userRepository.findOneById(user_id);

    const movie = await this.movieRepository.getOne(movie_id);

    if (!movie || movie.user_id !== user_id) {
      throw new UnauthorizedException();
    }

    await this.movieRepository.delete(movie_id);

    return 'Movie deleted!';
  }
}
