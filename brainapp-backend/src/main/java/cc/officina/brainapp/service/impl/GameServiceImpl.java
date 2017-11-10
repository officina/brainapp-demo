package cc.officina.brainapp.service.impl;

import cc.officina.brainapp.service.GameService;
import cc.officina.brainapp.domain.Game;
import cc.officina.brainapp.repository.GameRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


/**
 * Service Implementation for managing Game.
 */
@Service
@Transactional
public class GameServiceImpl implements GameService{

    private final Logger log = LoggerFactory.getLogger(GameServiceImpl.class);

    private final GameRepository gameRepository;

    public GameServiceImpl(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    /**
     * Save a game.
     *
     * @param game the entity to save
     * @return the persisted entity
     */
    @Override
    public Game save(Game game) {
        log.debug("Request to save Game : {}", game);
        return gameRepository.save(game);
    }

    /**
     *  Get all the games.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Game> findAll(Pageable pageable) {
        log.debug("Request to get all Games");
        return gameRepository.findAll(pageable);
    }

    /**
     *  Get one game by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Game findOne(Long id) {
        log.debug("Request to get Game : {}", id);
        return gameRepository.findOne(id);
    }

    /**
     *  Delete the  game by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Game : {}", id);
        gameRepository.delete(id);
    }
}
