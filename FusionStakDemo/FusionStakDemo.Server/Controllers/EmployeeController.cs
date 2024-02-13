using Microsoft.AspNetCore.Mvc;
using FusionStakDemo.Server.Models;
using FusionStakDemo.Server.Helpers;
using System.Linq.Expressions;
using System.Security.Claims;


namespace FusionStakDemo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {

        private readonly EmployeeRepository _employeeRepository;

        public EmployeeController(EmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
            
        }

        [HttpPost]
        public async Task<ActionResult> AddEmployee([FromBody] User model)
        {
            await _employeeRepository.AddEmployeeAsync(model);
            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetEmployeeList()
        {
            var employeeList = await _employeeRepository.GetAllEmployeeAsync();
            return Ok(employeeList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetEmployeeById([FromRoute] int id)
        {
            var employee = await _employeeRepository.GetEmployeeByIdAsync(id);
            return Ok(employee);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEmployee([FromRoute] int id, [FromBody] User model)
        {
            await _employeeRepository.UpdateEmployeeAsync(id, model);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployee([FromRoute] int id)
        {
            await _employeeRepository.DeleteEmployeeAsnyc(id);
            return Ok();
        }

        [HttpGet("page")]
        public async Task<ActionResult<User>> GetData(int pageNumber = 1, int pageSize = 5, string? role = null)
        {
            try
            {
                Expression<Func<User, bool>> filter = x => (role == null || x.Role == role);
                var data = await _employeeRepository.GetPagedAsync(filter, pageNumber, pageSize);
                var totalItems = await _employeeRepository.GetTotalCountAsync(filter);
                if (totalItems != null)
                {
                    // Return the paged data and total count
                    return Ok(new { data, totalItems });
                }
                else
                {
                    return BadRequest("'totalItems' field missing in the data.");
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions and return an appropriate error response
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }


        [HttpGet("sortedByFirstName")]
        public IActionResult GetSortedDataByFirstName()
        {
            try
            {
                var sortedData = _employeeRepository.GetSortedDataByFirstName();
                return Ok(sortedData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
        

    }
}

