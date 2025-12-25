using System.Threading.Channels;
using Asisya.Application.Interfaces;

namespace Asisya.Api.Importing;

public sealed class InMemoryImportQueue : IImportQueue
{
    private readonly Channel<ImportJobMessage> _channel =
        Channel.CreateUnbounded<ImportJobMessage>(new UnboundedChannelOptions
        {
            SingleReader = true,
            SingleWriter = false
        });

    public ValueTask EnqueueAsync(ImportJobMessage msg, CancellationToken ct)
        => _channel.Writer.WriteAsync(msg, ct);

    public ValueTask<ImportJobMessage> DequeueAsync(CancellationToken ct)
        => _channel.Reader.ReadAsync(ct);
}
