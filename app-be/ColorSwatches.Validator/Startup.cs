using System.Reflection;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;

namespace ColorSwatches.Validator;

public static class Startup
{
    public static IServiceCollection AddValidatorModel(this IMvcBuilder builder)
    {
        return builder.Services.AddFluentValidation(s =>
        {
            s.AutomaticValidationEnabled = true;
            s.RegisterValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        });
    }
}
