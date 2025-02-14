﻿using Microsoft.AspNetCore.Mvc;
using WebNewsProvenance.Models;
using WebNewsProvenance.Services.Sparql.Contracts;


namespace WebNewsProvenance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SparqlController : ControllerBase
    {
        private readonly ISparqlService _sparqlService;

        public SparqlController(ISparqlService sparqlService)
        {
            _sparqlService = sparqlService;
        }

        [HttpGet("test-sparql")]
        public IActionResult Get()
        {
            return Ok("SparqlController is working.");
        }
        [HttpGet("article-cards/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsPagination(int offset)
        {
            var response = await _sparqlService.GetAllArticlesCardPagination(offset);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }

        [HttpPost("article-cards-filters/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsFilteredPagination(int offset, [FromBody] Filter filters)
        {
            var response = await _sparqlService.GetAllArticlesCardFilterPagination(offset, filters);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("article-cards-search/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsSearchPagination(int offset, [FromQuery] string search)
        {
            var response = await _sparqlService.GetAllArticlesBySearchPagination(offset, search);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("{articleId}")]
        public async Task<IActionResult> GetArticleById(string articleId)
        {
            var response = await _sparqlService.GetAnArticleById(articleId);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                if (response.StatusCode == StatusCodes.Status404NotFound)
                {
                    return NotFound(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("recommended-articles/{category}")]
        public async Task<IActionResult> GetAllRecommendedArticlesCardPagination(string category)
        {
            var response = await _sparqlService.GetAllRecommendedArticlesCardPagination(category);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }

        [HttpPost("rdfa")]
        public async Task<IActionResult> PostRDFa([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            var response = await _sparqlService.ExecuteSparqlEndpointQueryAsync(request.Query, "rdfa");

            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }

        [HttpPost("jsonld")]
        public async Task<IActionResult> PostJsonLd([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            var response = await _sparqlService.ExecuteSparqlEndpointQueryAsync(request.Query, "jsonld");

            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }

            return Ok(response);
        }
    }

}
