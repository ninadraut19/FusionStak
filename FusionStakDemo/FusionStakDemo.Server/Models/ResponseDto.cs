using System;
using System.Collections.Generic;
namespace FusionStakDemo.Server.Models
{
    public class ResponseDto
    {
        public int Page { get; set; }
        public int CurrentPage { get; set; }

        public int UserCount { get; set; }
        public List<User> Users { get; set; } = new List<User>();
    }

}

