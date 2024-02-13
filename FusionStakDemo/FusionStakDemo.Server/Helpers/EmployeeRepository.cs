using FusionStakDemo.Server.Context;
using FusionStakDemo.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FusionStakDemo.Server.Helpers
{
    public class EmployeeRepository
    {
        private readonly AppDbContext _appDbContext;

        public EmployeeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task AddEmployeeAsync(User user)
        {
            await _appDbContext.Set<User>().AddAsync(user);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<List<User>> GetAllEmployeeAsync()
        {
            return await _appDbContext.Users.ToListAsync();
        }

        public async Task<User> GetEmployeeByIdAsync(int id)
        {
            return await _appDbContext.Users.FindAsync(id);
        }

        public async Task UpdateEmployeeAsync(int id, User model)
        {
            var usersdata = await _appDbContext.Users.FindAsync(id);
            if (usersdata == null)
            {
                throw new Exception("Employee not found");
            }
            usersdata.FirstName = model.FirstName;
            usersdata.LastName = model.LastName;
            usersdata.Email = model.Email;
            usersdata.Role = model.Role;
            usersdata.Password = model.Password;
            await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteEmployeeAsnyc(int id)
        {
            var userdata = await _appDbContext.Users.FindAsync(id);
            if (userdata == null)
            {
                throw new Exception("Employee not found");
            }
            _appDbContext.Users.Remove(userdata);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<User> GetEmplaoyeeByEmail(string email)
        {
            return await _appDbContext.Users.Where(x => x.Email == email).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUsersAsync(int page, int pageSize)
        {
            return await _appDbContext.Users.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public int GetUserCount()
        {
            return _appDbContext.Users.Count();
        }

        public async Task<IEnumerable<User>> GetPagedAsync(Expression<Func<User, bool>> filter, int pageNumber, int pageSize)
        {
            return await _appDbContext.Users
                .Where(filter)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync(Expression<Func<User, bool>> filter)
        {
            return await _appDbContext.Users.Where(filter).CountAsync();
        }

        public IQueryable<User> GetSortedDataByFirstName()
        {
            
            var sortedData = _appDbContext.Users.OrderBy(entity => entity.FirstName);
            return sortedData;
        }
        
    }
}

