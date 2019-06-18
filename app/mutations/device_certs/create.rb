module DeviceCerts
  class Create < Mutations::Command
    required do
      model  :device, class: Device
      array  :tags, class: String
      string :serial_number
    end

    def execute
      SendNervesHubInfoJob.perform_later(device_id:     device.id,
                                         serial_number: serial_number,
                                         tags:          tags)
      return device.update_attributes!(serial_number: serial_number) && device
    end
  end
end
