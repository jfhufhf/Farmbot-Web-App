require "spec_helper"

describe SendNervesHubInfoJob do
  let(:device) { FactoryBot.create(:device) }

  it "handles failure" do
    params = { device_id: device.id,
              serial_number: "xyz",
              tags: [],
              error: StandardError.new("Hello!") }
    not_work = receive(:maybe_create_or_update)
      .with(any_args)
      .and_raise(params.fetch(:error))
    expect(NervesHub).to not_work
    old_logger = ActiveJob::Base.logger
    ActiveJob::Base.logger = Logger.new(nil)
    expect do
      SendNervesHubInfoJob.perform_now(**params.except(:error))
    end.to raise_error(params.fetch(:error))
    ActiveJob::Base.logger = old_logger
  end

  it "returns early if create/update is nil" do
    params = { device_id: device.id,
              serial_number: "xyz",
              tags: [],
              error: StandardError.new("Hello!") }
    return_nil = receive(:maybe_create_or_update)
      .with(any_args)
      .and_return(nil)
    expect(NervesHub).to return_nil
    expect(NervesHub).not_to receive(:sign_device)
    SendNervesHubInfoJob.perform_now(**params.except(:error))
  end
end
